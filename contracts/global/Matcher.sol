// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "../deal/interfaces/ICore.sol";
import "./interfaces/IGlobalConfig.sol";
import "./interfaces/IMatcher.sol";
import "../utils/LinkedList.sol";
import "../deal/base/Types.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MatcherState {
    struct ComputeProvider {
        uint minPriceByEpoch;
        uint maxCollateral;
        address paymentToken;
        uint totalFreeWorkerSlots;
    }

    struct ComputePeer {
        uint freeWorkerSlots;
    }

    IGlobalConfig public immutable globalConfig;

    LinkedList.Bytes32List public computeProvidersList;
    LinkedList.Bytes32List public computePeersList;

    mapping(address => ComputeProvider) public computeProviders;
    mapping(Multihash => ComputePeer) public computePeers;

    mapping(address => bool) public whitelist;

    mapping(address => CIDV1[]) internal _effectorsByOwner;

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
    using LinkedList for LinkedList.Bytes32List;

    event ComputeProviderRegistered(
        address computeProvider,
        uint minPriceByEpoch,
        uint maxCollateral,
        uint workersCount,
        CIDV1[] effectors
    );

    constructor(IGlobalConfig globalConfig_) MatcherState(globalConfig_) {}

    function register(uint minPriceByEpoch, uint maxCollateral, uint workersCount, CIDV1[] calldata effectors) external {
        address owner = msg.sender;
        //TODO: require(whitelist[owner], "Only whitelisted can call this function");
        require(workersCount > 0, "Workers count should be greater than 0");
        require(maxCollateral > 0, "Max collateral should be greater than 0");
        require(resourceConfigs[owner].workersCount == 0, "Config already exists");

        uint amount = maxCollateral * workersCount;
        ResourceConfig memory config = ResourceConfig({
            minPriceByEpoch: minPriceByEpoch,
            maxCollateral: maxCollateral,
            workersCount: workersCount
        });

        for (uint i = 0; i < effectors.length; i++) {
            bytes32 dealEffector = keccak256(abi.encodePacked(effectors[i].prefixes, effectors[i].hash));
            _effectorsByOwner[owner].effectors[dealEffector] = true;
        }

        resourceConfigIds.push(bytes32(bytes20(owner)));

        resourceConfigs[owner] = config;

        globalConfig.fluenceToken().transferFrom(owner, address(this), amount);

        emit ComputeProviderRegistered(owner, minPriceByEpoch, maxCollateral, workersCount, effectors);
    }

    function remove() external {
        address owner = msg.sender;
        ResourceConfig storage resourceConfig = resourceConfigs[owner];

        require(resourceConfig.workersCount != 0, "Config doesn't exist");

        uint amount = resourceConfig.maxCollateral * resourceConfig.workersCount;
        delete resourceConfigs[owner];
        resourceConfigIds.remove(bytes32(bytes20(owner)));

        globalConfig.fluenceToken().transfer(owner, amount);
    }

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

        bytes32 currentId = resourceConfigIds.first();
        while (currentId != bytes32(0x00) && freeWorkerSlots > 0) {
            address computeProvider = address(bytes20(currentId));

            ResourceConfig storage resourceConfig = resourceConfigs[computeProvider];
            uint maxCollateral = resourceConfig.maxCollateral;
            uint workersCount = resourceConfig.workersCount;

            if (
                resourceConfig.minPriceByEpoch > pricePerEpoch ||
                maxCollateral < requiredCollateral ||
                !_isEffectorsMatched(config, computeProvider)
            ) {
                currentId = resourceConfigIds.next(currentId);
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
                delete resourceConfigs[computeProvider];
                resourceConfigIds.remove(bytes32(bytes20(computeProvider)));
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
            currentId = resourceConfigIds.next(currentId);

            emit Matched(computeProvider, address(deal), joinedWorkers, creationBlock, appCID);
        }
    }
}
