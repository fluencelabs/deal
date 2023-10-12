// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IMatcherConfig.sol";
import "../interfaces/IGlobalCore.sol";
import "../../utils/LinkedListWithUniqueKeys.sol";
import "../../utils/ComputeProvidersList.sol";
import "../../deal/base/Types.sol";

contract MatcherConfig is IMatcherConfig {
    using LinkedListWithUniqueKeys for LinkedListWithUniqueKeys.Bytes32List;
    using SafeERC20 for IERC20;

    // ----------------- Immutable -----------------
    IGlobalCore public immutable _globalCore;

    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.matcher.storage.v1.config")) - 1);

    struct ConfigStorage {
        // Compute providers
        LinkedListWithUniqueKeys.Bytes32List computeProvidersList;
        mapping(address => ComputeProvider) computeProviderByOwner;
        // Compute peers
        mapping(address => LinkedListWithUniqueKeys.Bytes32List) computePeersListByProvider;
        mapping(bytes32 => ComputePeer) computePeerByPeerId;
        mapping(address => mapping(bytes32 => bool)) effectorsByComputeProvider;
        // Matching
        mapping(IDeal => uint) minMatchingEpochByDeal;
    }

    ConfigStorage private _storage;

    function _getConfigStorage() internal pure returns (ConfigStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ----------------- Constructor -----------------
    constructor(IGlobalCore globalCore_) {
        _globalCore = globalCore_;
    }

    // ----------------- Internal -----------------
    function _getComputeProvider(address owner) internal view returns (ComputeProvider storage) {
        ComputeProvider storage computeProvider = _getConfigStorage().computeProviderByOwner[owner];
        require(address(computeProvider.paymentToken) != address(0x00), "Compute provider doesn't exist");

        return computeProvider;
    }

    function _doComputeProviderHasEffectors(address computeProvider, CIDV1[] memory effectors) internal view returns (bool) {
        ConfigStorage storage configStorage = _getConfigStorage();

        uint256 length = effectors.length;
        for (uint i = 0; i < length; i++) {
            bytes32 dealEffector = keccak256(abi.encodePacked(effectors[i].prefixes, effectors[i].hash));
            if (!configStorage.effectorsByComputeProvider[computeProvider][dealEffector]) {
                return false;
            }
        }

        return true;
    }

    // ----------------- Public View -----------------
    function getComputeProviderInfo(address provider) external view returns (ComputeProvider memory) {
        return _getConfigStorage().computeProviderByOwner[provider];
    }

    function getPeersByComputeProvider(address provider) external view returns (bytes32[] memory peerIds, ComputePeer[] memory) {
        ConfigStorage storage configStorage = _getConfigStorage();

        LinkedListWithUniqueKeys.Bytes32List storage peersList = configStorage.computePeersListByProvider[provider];
        ComputePeer[] memory result = new ComputePeer[](peersList.length());
        bytes32[] memory ids = new bytes32[](peersList.length());

        uint i = 0;
        bytes32 peerId = peersList.first();
        while (peerId != bytes32(0x00)) {
            result[i] = configStorage.computePeerByPeerId[peerId];
            ids[i] = peerId;

            i++;

            peerId = peersList.next(peerId);
        }

        return (ids, result);
    }

    function getComputePeerInfo(bytes32 peerId) external view returns (ComputePeer memory) {
        return _getConfigStorage().computePeerByPeerId[peerId];
    }

    // ----------------- Public Mutable -----------------
    function registerComputeProvider(uint minPricePerEpoch, uint maxCollateral, IERC20 paymentToken, CIDV1[] calldata effectors) external {
        ConfigStorage storage configStorage = _getConfigStorage();

        //TODO: add global whitelist

        // validate input
        require(minPricePerEpoch > 0, "Min price per epoch should be greater than 0");
        require(maxCollateral > 0, "Max collateral should be greater than 0");
        require(address(paymentToken) != address(0x00), "Compute provider already");

        address owner = msg.sender;
        require(address(configStorage.computeProviderByOwner[owner].paymentToken) == address(0x00), "Compute provider already");

        // register compute provider
        configStorage.computeProviderByOwner[owner] = ComputeProvider({
            minPricePerEpoch: minPricePerEpoch,
            maxCollateral: maxCollateral,
            paymentToken: paymentToken,
            totalFreeWorkerSlots: 0
        });
        configStorage.computeProvidersList.push(bytes32(bytes20(owner)));

        // register effectors
        for (uint i = 0; i < effectors.length; i++) {
            bytes32 dealEffector = keccak256(abi.encodePacked(effectors[i].prefixes, effectors[i].hash));
            configStorage.effectorsByComputeProvider[owner][dealEffector] = true;
        }

        emit ComputeProviderRegistered(owner, minPricePerEpoch, maxCollateral, paymentToken, effectors);
    }

    function addWorkersSlots(bytes32 peerId, uint workerSlots) external {
        ConfigStorage storage configStorage = _getConfigStorage();

        address owner = msg.sender;

        require(workerSlots > 0, "Worker slots should be greater than 0");

        // calculate new free worker slots
        uint256 freeWorkerSlots = configStorage.computePeerByPeerId[peerId].freeWorkerSlots;

        // add peer to compute provider list if it's not there
        if (freeWorkerSlots == 0) {
            configStorage.computePeersListByProvider[owner].push(peerId);
        }

        freeWorkerSlots += workerSlots;

        configStorage.computePeerByPeerId[peerId].freeWorkerSlots = freeWorkerSlots;

        // put collateral
        uint amount = configStorage.computeProviderByOwner[owner].maxCollateral * workerSlots;
        configStorage.computeProviderByOwner[owner].paymentToken.safeTransferFrom(owner, address(this), amount);

        emit WorkersSlotsChanged(peerId, freeWorkerSlots);
    }

    function subWorkersSlots(bytes32 peerId, uint workerSlots) external {
        ConfigStorage storage configStorage = _getConfigStorage();

        address owner = msg.sender;

        // validate input
        uint256 freeWorkerSlots = configStorage.computePeerByPeerId[peerId].freeWorkerSlots - workerSlots;
        configStorage.computePeerByPeerId[peerId].freeWorkerSlots = freeWorkerSlots;

        // remove peer from compute provider list if it has no free worker slots
        if (freeWorkerSlots == 0) {
            configStorage.computePeersListByProvider[owner].remove(peerId);
        }

        // retrun collateral
        uint amount = configStorage.computeProviderByOwner[owner].maxCollateral * workerSlots;
        configStorage.computeProviderByOwner[owner].paymentToken.safeTransferFrom(address(this), owner, amount);

        emit WorkersSlotsChanged(peerId, freeWorkerSlots);
    }

    function changeMinPricePerEpoch(uint newMinPricePerEpoch) external {
        require(newMinPricePerEpoch > 0, "Min price per epoch should be greater than 0");

        ComputeProvider storage computeProvider = _getComputeProvider(msg.sender);

        computeProvider.minPricePerEpoch = newMinPricePerEpoch;

        emit MinPricePerEpochChanged(msg.sender, newMinPricePerEpoch);
    }

    function changeMaxCollateral(uint newMaxCollateral) external {
        require(newMaxCollateral > 0, "Max collateral should be greater than 0");

        address owner = msg.sender;
        ComputeProvider storage computeProvider = _getComputeProvider(owner);

        uint oldMaxCollateral = computeProvider.maxCollateral;

        require(oldMaxCollateral != newMaxCollateral, "Max collateral is the same");
        computeProvider.maxCollateral = newMaxCollateral;

        // if compute provider has no free worker slots. Do nothing.
        if (computeProvider.totalFreeWorkerSlots == 0) {
            return;
        }

        // calculate new collateral
        if (oldMaxCollateral > newMaxCollateral) {
            uint amount = (oldMaxCollateral - newMaxCollateral) * computeProvider.totalFreeWorkerSlots;

            computeProvider.paymentToken.safeTransfer(owner, amount);
        } else {
            uint amount = (newMaxCollateral - oldMaxCollateral) * computeProvider.totalFreeWorkerSlots;

            computeProvider.paymentToken.safeTransferFrom(owner, address(this), amount);
        }

        emit MaxCollateralChanged(owner, newMaxCollateral);
    }

    function changePaymentToken(IERC20 newPaymentToken, uint newMaxCollateral) external {
        require(address(newPaymentToken) != address(0x00), "Payment token should be not zero address");

        address owner = msg.sender;
        ComputeProvider storage computeProvider = _getComputeProvider(owner);

        IERC20 oldPaymentToken = computeProvider.paymentToken;
        computeProvider.paymentToken = newPaymentToken;

        uint oldAmount = computeProvider.maxCollateral * computeProvider.totalFreeWorkerSlots;
        oldPaymentToken.safeTransfer(owner, oldAmount);

        uint newAmount = newMaxCollateral * computeProvider.totalFreeWorkerSlots;
        newPaymentToken.safeTransferFrom(owner, address(this), newAmount);

        emit PaymentTokenChanged(owner, newPaymentToken);
    }

    function addEffector(CIDV1 calldata effector) external {
        ConfigStorage storage configStorage = _getConfigStorage();

        address owner = msg.sender;

        bytes32 effectorCIDHash = keccak256(abi.encodePacked(effector.prefixes, effector.hash));

        require(configStorage.effectorsByComputeProvider[owner][effectorCIDHash] == false, "Effector already exists");
        configStorage.effectorsByComputeProvider[owner][effectorCIDHash] = true;

        emit EffectorAdded(owner, effector);
    }

    function removeEffector(CIDV1 calldata effector) external {
        ConfigStorage storage configStorage = _getConfigStorage();

        address owner = msg.sender;

        bytes32 effectorCIDHash = keccak256(abi.encodePacked(effector.prefixes, effector.hash));

        require(configStorage.effectorsByComputeProvider[owner][effectorCIDHash] == true, "Effector doesn't exist");
        configStorage.effectorsByComputeProvider[owner][effectorCIDHash] = false;

        emit EffectorRemoved(owner, effector);
    }

    function removeComputeProvider() external {
        ConfigStorage storage configStorage = _getConfigStorage();

        address owner = msg.sender;
        ComputeProvider storage computeProvider = _getComputeProvider(owner);

        require(address(computeProvider.paymentToken) != address(0x00), "Compute provider doesn't exist");

        IERC20 paymentToken = computeProvider.paymentToken;
        uint amount = computeProvider.maxCollateral * computeProvider.totalFreeWorkerSlots;

        delete computeProvider.minPricePerEpoch;
        delete computeProvider.maxCollateral;
        delete computeProvider.paymentToken;
        delete computeProvider.totalFreeWorkerSlots;

        paymentToken.safeTransfer(owner, amount);

        configStorage.computeProvidersList.remove(bytes32(bytes20(owner)));

        emit ComputeProviderRemoved(owner);
    }
}
