// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "../deal/interfaces/ICore.sol";
import "./interfaces/IGlobalConfig.sol";
import "./interfaces/IMatcher.sol";
import "../utils/LinkedList.sol";
import "../deal/base/Types.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MatcherState {
    struct ComputeProvider {
        uint minPricePerEpoch;
        uint maxCollateral;
        IERC20 paymentToken;
        uint totalFreeWorkerSlots;
    }

    struct ComputePeer {
        bytes32 peerId;
        uint freeWorkerSlots;
    }

    IGlobalConfig public immutable globalConfig;

    // --- Events ---

    event ComputeProviderMatched(address indexed computeProvider, address deal, uint dealCreationBlock, CIDV1 appCID);

    event ComputePeerMatched(bytes32 indexed peerId, address deal, bytes32[] patIds, uint dealCreationBlock, CIDV1 appCID);

    event ComputeProviderRegistered(
        address computeProvider,
        uint minPricePerEpoch,
        uint maxCollateral,
        IERC20 paymentToken,
        CIDV1[] effectors
    );

    event WorkersSlotsChanged(bytes32 peerId, uint newWorkerSlots);

    // --- Compute Providers ---

    mapping(address => ComputeProvider) public computeProviderByOwner;
    mapping(bytes32 => ComputePeer) public computePeerByPeerIdHash;

    LinkedList.Bytes32List internal _computeProvidersList;
    mapping(address => LinkedList.Bytes32List) internal _computePeersListByProvider;

    mapping(address => mapping(bytes32 => bool)) internal _effectorsByComputePeerOwner;

    // --- Whitelist Area ---
    mapping(address => bool) public whitelist;

    constructor(IGlobalConfig globalConfig_) {
        globalConfig = globalConfig_;
    }
}

abstract contract MatcherInternal is MatcherState, UUPSUpgradeable {
    using SafeERC20 for IERC20;
    using LinkedList for LinkedList.Bytes32List;

    modifier onlyOwner() {
        require(msg.sender == globalConfig.owner(), "Only owner can call this function");
        _;
    }

    function _getComputeProvider(address owner) internal returns (ComputeProvider storage) {
        ComputeProvider storage computeProvider = computeProviderByOwner[owner];
        require(address(computeProvider.paymentToken) != address(0x00), "Compute provider doesn't exist");

        return computeProvider;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function _isEffectorsMatched(IConfigModule dealConfig, address computeProvider) internal view returns (bool) {
        CIDV1[] memory dealEffectors = dealConfig.effectors();

        for (uint i = 0; i < dealEffectors.length; i++) {
            bytes32 dealEffector = keccak256(abi.encodePacked(dealEffectors[i].prefixes, dealEffectors[i].hash));
            if (!_effectorsByComputePeerOwner[computeProvider][dealEffector]) {
                return false;
            }
        }

        return true;
    }
}

abstract contract MatcherOwnable is MatcherInternal {
    function setWhiteList(address owner, bool hasAccess) external onlyOwner {
        whitelist[owner] = hasAccess;
    }
}

contract Matcher is IMatcher, MatcherOwnable {
    using SafeERC20 for IERC20;
    using LinkedList for LinkedList.Bytes32List;

    constructor(IGlobalConfig globalConfig_) MatcherState(globalConfig_) {}

    function getFreeWorkersSolts(address computeProvider, bytes32 peerId) external view returns (uint) {
        return computePeerByPeerIdHash[peerId].freeWorkerSlots;
    }

    function registerComputeProvider(uint minPricePerEpoch, uint maxCollateral, IERC20 paymentToken, CIDV1[] calldata effectors) external {
        //TODO: require(whitelist[owner], "Only whitelisted can call this function");

        require(minPricePerEpoch > 0, "Min price per epoch should be greater than 0");
        require(maxCollateral > 0, "Max collateral should be greater than 0");
        require(address(paymentToken) != address(0x00), "Compute provider already");

        address owner = msg.sender;
        require(address(computeProviderByOwner[owner].paymentToken) == address(0x00), "Compute provider already");

        computeProviderByOwner[owner] = ComputeProvider({
            minPricePerEpoch: minPricePerEpoch,
            maxCollateral: maxCollateral,
            paymentToken: paymentToken,
            totalFreeWorkerSlots: 0
        });

        for (uint i = 0; i < effectors.length; i++) {
            bytes32 dealEffector = keccak256(abi.encodePacked(effectors[i].prefixes, effectors[i].hash));
            _effectorsByComputePeerOwner[owner][dealEffector] = true;
        }

        _computeProvidersList.push(bytes32(bytes20(owner)));

        emit ComputeProviderRegistered(owner, minPricePerEpoch, maxCollateral, paymentToken, effectors);
    }

    function addWorkersSlots(bytes32 peerId, uint workerSlots) external {
        address owner = msg.sender;

        require(workerSlots > 0, "Worker slots should be greater than 0");

        uint256 freeWorkerSlots = computePeerByPeerIdHash[peerId].freeWorkerSlots + workerSlots;
        computePeerByPeerIdHash[peerId].freeWorkerSlots = freeWorkerSlots;

        if (freeWorkerSlots == workerSlots) {
            _computePeersListByProvider[owner].push(peerId);
        }

        uint amount = computeProviderByOwner[owner].maxCollateral * workerSlots;
        computeProviderByOwner[owner].paymentToken.safeTransferFrom(owner, address(this), amount);

        emit WorkersSlotsChanged(peerId, freeWorkerSlots);
    }

    function subWorkersSlots(bytes32 peerId, uint workerSlots) external {
        address owner = msg.sender;

        uint256 freeWorkerSlots = computePeerByPeerIdHash[peerId].freeWorkerSlots - workerSlots;
        computePeerByPeerIdHash[peerId].freeWorkerSlots = freeWorkerSlots;

        if (freeWorkerSlots == 0) {
            _computePeersListByProvider[owner].remove(peerId);
        }

        uint amount = computeProviderByOwner[owner].maxCollateral * workerSlots;
        computeProviderByOwner[owner].paymentToken.safeTransferFrom(address(this), owner, amount);

        emit WorkersSlotsChanged(peerId, freeWorkerSlots);
    }

    function changeMinPricePerEpoch(uint newMinPricePerEpoch) external {
        require(newMinPricePerEpoch > 0, "Min price per epoch should be greater than 0");

        ComputeProvider storage computeProvider = _getComputeProvider(msg.sender);

        computeProvider.minPricePerEpoch = newMinPricePerEpoch;

        // event
    }

    function changeMaxCollateral(uint newMaxCollateral) external {
        require(newMaxCollateral > 0, "Max collateral should be greater than 0");

        address owner = msg.sender;
        ComputeProvider storage computeProvider = _getComputeProvider(owner);

        uint oldMaxCollateral = computeProvider.maxCollateral;
        computeProvider.maxCollateral = newMaxCollateral;

        if (computeProvider.totalFreeWorkerSlots == 0 || oldMaxCollateral == newMaxCollateral) {
            return;
        }

        if (oldMaxCollateral > newMaxCollateral) {
            uint amount = (oldMaxCollateral - newMaxCollateral) * computeProvider.totalFreeWorkerSlots;

            computeProvider.paymentToken.safeTransfer(owner, amount);
        } else {
            uint amount = (newMaxCollateral - oldMaxCollateral) * computeProvider.totalFreeWorkerSlots;

            computeProvider.paymentToken.safeTransferFrom(owner, address(this), amount);
        }

        // event
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

        // event
    }

    function addEffector(CIDV1 calldata effector) external {
        address owner = msg.sender;

        bytes32 effectorCIDHash = keccak256(abi.encodePacked(effector.prefixes, effector.hash));

        require(_effectorsByComputePeerOwner[owner][effectorCIDHash] == false, "Effector already exists");
        _effectorsByComputePeerOwner[owner][effectorCIDHash] = true;
    }

    function removeEffector(CIDV1 calldata effector) external {
        address owner = msg.sender;

        bytes32 effectorCIDHash = keccak256(abi.encodePacked(effector.prefixes, effector.hash));

        require(_effectorsByComputePeerOwner[owner][effectorCIDHash] == true, "Effector doesn't exist");
        _effectorsByComputePeerOwner[owner][effectorCIDHash] = false;
    }

    function removeComputeProvider() external {
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

        _computeProvidersList.remove(bytes32(bytes20(owner)));

        // event
    }

    // --- Deals ---

    function matchWithDeal(ICore deal) external {
        require(globalConfig.factory().isDeal(address(deal)), "Deal is not from factory");

        IConfigModule config = deal.configModule();
        uint requiredCollateral = config.requiredCollateral();
        uint pricePerEpoch = config.pricePerEpoch();
        uint maxWorkersPerProvider = config.maxWorkersPerProvider();
        uint creationBlock = config.creationBlock();
        CIDV1 memory appCID = config.appCID();

        IWorkersModule workersModule = deal.workersModule();
        uint freeWorkerSlotsInDeal = config.targetWorkers() - workersModule.patCount();

        bytes32 currentId = _computeProvidersList.first();
        while (currentId != bytes32(0x00) && freeWorkerSlotsInDeal > 0) {
            address computeProviderAddress = address(bytes20(currentId));

            ComputeProvider storage computeProvider = computeProviderByOwner[computeProviderAddress];
            uint maxCollateral = computeProvider.maxCollateral;

            if (
                computeProvider.minPricePerEpoch > pricePerEpoch ||
                maxCollateral < requiredCollateral ||
                !_isEffectorsMatched(config, computeProviderAddress)
            ) {
                currentId = _computeProvidersList.next(currentId);
                continue;
            }

            _findPeersForMatching(
                computeProviderAddress,
                maxWorkersPerProvider,
                freeWorkerSlotsInDeal,
                maxCollateral,
                requiredCollateral,
                address(deal),
                workersModule,
                creationBlock,
                appCID
            );

            currentId = _computeProvidersList.next(currentId);

            emit ComputeProviderMatched(computeProviderAddress, address(deal), creationBlock, appCID);
        }
    }

    function _findPeersForMatching(
        address computeProvider,
        uint maxWorkersPerProvider,
        uint freeWorkerSlotsInDeal,
        uint maxCollateral,
        uint requiredCollateral,
        address deal,
        IWorkersModule workersModule,
        uint dealCreationBlock,
        CIDV1 memory appCID
    ) internal {
        bytes32 hashOfPeerId = _computePeersListByProvider[computeProvider].first();

        while (hashOfPeerId != bytes32(0x00)) {
            bytes32 peerId = computePeerByPeerIdHash[hashOfPeerId].peerId;
            uint freeWorkerSlots = computePeerByPeerIdHash[hashOfPeerId].freeWorkerSlots;

            uint receivedWorkersSlots;
            if (maxWorkersPerProvider > freeWorkerSlots) {
                receivedWorkersSlots = freeWorkerSlots;
            } else {
                receivedWorkersSlots = maxWorkersPerProvider;
            }

            if (receivedWorkersSlots > freeWorkerSlotsInDeal) {
                receivedWorkersSlots = freeWorkerSlotsInDeal;
            }

            if (receivedWorkersSlots == freeWorkerSlots) {
                delete computePeerByPeerIdHash[hashOfPeerId];
                _computePeersListByProvider[computeProvider].remove(hashOfPeerId);
            } else {
                computePeerByPeerIdHash[hashOfPeerId].freeWorkerSlots = freeWorkerSlots - receivedWorkersSlots;
            }

            globalConfig.fluenceToken().approve(address(workersModule), requiredCollateral * receivedWorkersSlots);
            for (uint j = 0; j < receivedWorkersSlots; j++) {
                workersModule.createPAT(computeProvider, peerId);
            }

            uint refoundByWorker = maxCollateral - requiredCollateral;
            if (refoundByWorker > 0) {
                globalConfig.fluenceToken().transfer(computeProvider, refoundByWorker * receivedWorkersSlots);
            }

            hashOfPeerId = _computePeersListByProvider[computeProvider].next(hashOfPeerId);

            PAT[] memory pats = workersModule.getPATs();
            bytes32[] memory patIds = new bytes32[](pats.length);

            uint patLength = pats.length;
            for (uint i = 0; i < patLength; i++) {
                patIds[i] = pats[i].id;
            }

            emit ComputePeerMatched(peerId, deal, patIds, dealCreationBlock, appCID);
        }
    }
}
