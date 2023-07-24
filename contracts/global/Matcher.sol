// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "../deal/interfaces/ICore.sol";
import "./interfaces/IGlobalConfig.sol";
import "./interfaces/IMatcher.sol";
import "../utils/LinkedList.sol";
import "../deal/base/Types.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MatcherState {
    struct ComputeProvider {
        uint minPricePerEpoch;
        uint maxCollateral;
        address paymentToken;
        uint totalFreeWorkerSlots;
    }

    struct ComputePeer {
        uint freeWorkerSlots;
    }

    IGlobalConfig public immutable globalConfig;

    // --- Compute Providers ---

    mapping(address => ComputeProvider) public computeProviderByOwner;
    mapping(bytes32 => ComputePeer) public computePeerByPeerIdHash;

    LinkedList.Bytes32List internal _computeProvidersList;
    mapping(address => LinkedList.Bytes32List) internal _computePeersListByProvider;

    mapping(address => CIDV1[]) internal _effectorsByOwner;

    // --- Whitelist Area ---
    mapping(address => bool) public whitelist;

    constructor(IGlobalConfig globalConfig_) {
        globalConfig = globalConfig_;
    }
}

abstract contract MatcherInternal is MatcherState, UUPSUpgradeable {
    using LinkedList for LinkedList.Bytes32List;

    event Matched(address indexed computeProvider, address deal, uint joinedWorkers, uint dealCreationBlock, CIDV1 appCID);

    modifier onlyOwner() {
        require(msg.sender == globalConfig.owner(), "Only owner can call this function");
        _;
    }

    function _getComputeProvider(address owner) internal returns (ComputeProvider storage) {
        ComputeProvider storage computeProvider = computeProviderByOwner[owner];
        require(computeProvider.paymentToken != address(0x00), "Compute provider doesn't exist");

        return computeProvider;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function _isEffectorsMatched(IConfigModule dealConfig, address computeProvider) internal view returns (bool) {
        CIDV1[] memory dealEffectors = dealConfig.effectors();

        for (uint i = 0; i < dealEffectors.length; i++) {
            bytes32 dealEffector = keccak256(abi.encodePacked(dealEffectors[i].prefixes, dealEffectors[i].hash));
            if (!_effectorsByOwner[computeProvider].effectors[dealEffector]) {
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

    event ComputeProviderRegistered(
        address computeProvider,
        uint minPricePerEpoch,
        uint maxCollateral,
        IERC20 paymentToken,
        CIDV1[] effectors
    );

    event ComputePeerRegistered(Multihash peerId, uint workerSlots);

    event ComputePeerWorkerSlotsChanged(Multihash peerId, uint newWorkerSlots);

    constructor(IGlobalConfig globalConfig_) MatcherState(globalConfig_) {}

    // --- Compute Providers ---

    function registerComputeProvider(uint minPricePerEpoch, uint maxCollateral, address paymentToken, CIDV1[] calldata effectors) external {
        //TODO: require(whitelist[owner], "Only whitelisted can call this function");

        require(minPricePerEpoch > 0, "Min price per epoch should be greater than 0");
        require(maxCollateral > 0, "Max collateral should be greater than 0");
        require(paymentToken != address(0x00), "Compute provider already");

        address owner = msg.sender;
        require(computeProviderByOwner[owner].paymentToken == address(0x00), "Compute provider already");

        computeProviderByOwner[owner] = ComputeProvider({
            minPricePerEpoch: minPricePerEpoch,
            maxCollateral: maxCollateral,
            paymentToken: paymentToken,
            totalFreeWorkerSlots: 0
        });

        for (uint i = 0; i < effectors.length; i++) {
            bytes32 dealEffector = keccak256(abi.encodePacked(effectors[i].prefixes, effectors[i].hash));
            _effectorsByOwner[owner].effectors[dealEffector] = true;
        }

        _computeProvidersList.push(owner);

        emit ComputeProviderRegistered(owner, minPricePerEpoch, maxCollateral, paymentToken, effectors);
    }

    function registerComputePeer(Multihash peerId, uint workerSlots) external {
        address owner = msg.sender;
        bytes32 peerIdHash = keccak256(abi.encodePacked(peerId.hashCode, peerId.length, peerId.value));

        require(computePeerByPeerIdHash[peerIdHash].freeWorkerSlots == 0, "Compute peer already registered");

        computePeerByPeerIdHash[peerIdHash] = ComputePeer({ freeWorkerSlots: freeWorkerSlots });

        _computePeersListByProvider[owner].push(peerIdHash);

        emit ComputePeerRegistered(peerId, workerSlots);
    }

    function addWorkersSlots(Multihash peerId, uint workerSlots) external {
        address owner = msg.sender;
        bytes32 peerIdHash = keccak256(abi.encodePacked(peerId.hashCode, peerId.length, peerId.value));

        require(computePeerByPeerIdHash[peerIdHash].freeWorkerSlots != 0, "Compute peer doesn't exist");

        uint256 freeWorkerSlots = computePeerByPeerIdHash[peerIdHash].freeWorkerSlots + workerSlots;
        computePeerByPeerIdHash[peerIdHash].freeWorkerSlots = freeWorkerSlots;

        emit ComputePeerWorkerSlotsChanged(peerId, freeWorkerSlots);
    }

    function subWorkersSlots(Multihash peerId, uint workerSlots) external {
        address owner = msg.sender;
        bytes32 peerIdHash = keccak256(abi.encodePacked(peerId.hashCode, peerId.length, peerId.value));

        require(computePeerByPeerIdHash[peerIdHash].freeWorkerSlots != 0, "Compute peer doesn't exist");

        uint256 freeWorkerSlots = computePeerByPeerIdHash[peerIdHash].freeWorkerSlots - workerSlots;
        computePeerByPeerIdHash[peerIdHash].freeWorkerSlots = freeWorkerSlots;

        if (freeWorkerSlots == 0) {
            _computePeersListByProvider[owner].remove(peerIdHash);
        }

        emit ComputePeerWorkerSlotsChanged(peerId, freeWorkerSlots);
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

            computeProvider.paymentToken.safeTransferFrom(owner, this, amount);
        }

        // event
    }

    function changePaymentToken(address newPaymentToken, uint newMaxCollateral) external {
        require(newPaymentToken != address(0x00, "Payment token should be not zero address"));

        address owner = msg.sender;
        ComputeProvider storage computeProvider = _getComputeProvider(owner);

        IERC20 oldPaymentToken = computeProvider.paymentToken;
        computeProvider.paymentToken = newPaymentToken;

        uint oldAmount = computeProvider.maxCollateral * computeProvider.totalFreeWorkerSlots;
        oldPaymentToken.safeTransferFrom(owner, oldAmount);

        uint newAmount = newMaxCollateral * computeProvider.totalFreeWorkerSlots;
        newPaymentToken.safeTransferFrom(owner, this, newAmount);

        // event
    }

    function addEffector(CIDV1 calldata effector) external {
        address owner = msg.sender;

        bytes32 effectorCIDHash = keccak256(abi.encodePacked(effector.prefixes, effector.hash));

        require(_effectorsByOwner[owner].effectors[effectorCIDHash] == false, "Effector already exists");
        _effectorsByOwner[owner].effectors[effectorCIDHash] = true;
    }

    function removeEffector(CIDV1 calldata effector) external {
        address owner = msg.sender;

        bytes32 effectorCIDHash = keccak256(abi.encodePacked(effector.prefixes, effector.hash));

        require(_effectorsByOwner[owner].effectors[effectorCIDHash] == true, "Effector doesn't exist");
        _effectorsByOwner[owner].effectors[effectorCIDHash] = false;
    }

    function removeComputeProvider() external {
        address owner = msg.sender;
        ComputeProvider storage computeProvider = _getComputeProvider(owner);

        require(address(computeProvider.paymentToken) != address(0x00), "Compute provider doesn't exist");

        IERC20 paymentToken = computeProvider.paymentToken;
        uint amount = computeProvider.maxCollateral * computeProvider.totalFreeWorkerSlots;
        delete computeProvider;

        paymentToken.safeTransfer(owner, amount);

        _computeProvidersList.remove(owner);

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
        uint freeWorkerSlots = config.targetWorkers() - workersModule.workersCount();

        bytes32 currentId = _computeProvidersList.first();
        while (currentId != bytes32(0x00) && freeWorkerSlots > 0) {
            address computeProviderAddress = address(bytes20(currentId));

            ComputeProvider storage computeProvider = computeProviderByOwner[computeProviderAddress];

            uint maxCollateral = computeProvider.maxCollateral;
            uint workersCount = computeProvider.workersCount;

            if (
                computeProvider.minPricePerEpoch > pricePerEpoch ||
                maxCollateral < requiredCollateral ||
                !_isEffectorsMatched(config, computeProviderAddress)
            ) {
                currentId = _computeProvidersList.next(currentId);
                continue;
            }

            uint joinedWorkers;
            if (maxWorkersPerProvider > workersCount) {
                joinedWorkers = workersCount;
            } else {
                joinedWorkers = maxWorkersPerProvider;
            }

            if (joinedWorkers > freeWorkerSlots) {
                joinedWorkers = freeWorkerSlots;
            }

            uint newWorkersCount = workersCount - joinedWorkers;
            if (newWorkersCount == 0) {
                delete computeProvider[computeProvider];
                _computeProvidersList.remove(bytes32(bytes20(computeProvider)));
            } else {
                workersCount = newWorkersCount;
            }

            globalConfig.fluenceToken().approve(address(workersModule), requiredCollateral * joinedWorkers);
            for (uint j = 0; j < joinedWorkers; j++) {
                workersModule.joinViaMatcher(computeProvider);
            }

            uint refoundByWorker = maxCollateral - requiredCollateral;
            if (refoundByWorker > 0) {
                globalConfig.fluenceToken().transfer(computeProvider, refoundByWorker * joinedWorkers);
            }

            freeWorkerSlots -= joinedWorkers;
            currentId = _computeProvidersList.next(currentId);

            emit Matched(computeProvider, address(deal), joinedWorkers, creationBlock, appCID);
        }
    }
}
