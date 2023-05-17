// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "../deal/interfaces/ICore.sol";
import "./interfaces/IGlobalConfig.sol";
import "./interfaces/IMatcher.sol";
import "../utils/LinkedList.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MatcherState {
    struct ResourceConfig {
        uint minPriceByEpoch;
        uint maxCollateral;
        uint workersCount;
    }

    struct Effectors {
        mapping(string => bool) effectors;
    }

    IGlobalConfig public immutable globalConfig;

    LinkedList.Bytes32List public resourceConfigIds;
    mapping(address => ResourceConfig) public resourceConfigs;
    mapping(address => bool) public whitelist;

    mapping(address => Effectors) effectorsByOwner;

    constructor(IGlobalConfig globalConfig_) {
        globalConfig = globalConfig_;
    }
}

abstract contract MatcherInternal is MatcherState, UUPSUpgradeable {
    using LinkedList for LinkedList.Bytes32List;

    modifier onlyOwner() {
        require(msg.sender == globalConfig.owner(), "Only owner can call this function");
        _;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function _isEffectorsMatched(IConfig dealConfig, address resourceOwner) internal view returns (bool) {
        string[] memory dealEffectors = dealConfig.effectors();

        for (uint i = 0; i < dealEffectors.length; i++) {
            if (!effectorsByOwner[resourceOwner].effectors[dealEffectors[i]]) {
                return false;
            }
        }

        return true;
    }

    function _joinDeal(
        IController controller,
        IWorkers workersController,
        address resourceOwner,
        uint maxCollateral,
        uint workersCount,
        uint requiredStake,
        uint maxWorkersPerProvider,
        uint freeWorkerSlots
    ) internal returns (uint) {
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
            delete resourceConfigs[resourceOwner];
            resourceConfigIds.remove(bytes32(bytes20(resourceOwner)));
        } else {
            workersCount = newWorkersCount;
        }

        globalConfig.fluenceToken().approve(address(workersController), requiredStake * joinedWorkers);
        for (uint j = 0; j < joinedWorkers; j++) {
            controller.joinViaMatcher(resourceOwner);
        }

        uint refoundByWorker = maxCollateral - requiredStake;
        if (refoundByWorker > 0) {
            globalConfig.fluenceToken().transfer(resourceOwner, refoundByWorker * joinedWorkers);
        }

        return joinedWorkers;
    }
}

abstract contract MatcherOwnable is MatcherInternal {
    function setWhiteList(address owner, bool hasAccess) external onlyOwner {
        whitelist[owner] = hasAccess;
    }
}

contract Matcher is IMatcher, MatcherOwnable {
    using LinkedList for LinkedList.Bytes32List;

    constructor(IGlobalConfig globalConfig_) MatcherState(globalConfig_) {}

    function register(uint minPriceByEpoch, uint maxCollateral, uint workersCount, string[] calldata effectors) external {
        address owner = msg.sender;
        require(whitelist[owner], "Only whitelisted can call this function");
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
            effectorsByOwner[owner].effectors[effectors[i]] = true;
        }

        resourceConfigIds.push(bytes32(bytes20(owner)));

        resourceConfigs[owner] = config;

        globalConfig.fluenceToken().transferFrom(owner, address(this), amount);
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

        IController controller = deal.getController();
        IConfig config = deal.getConfig();

        uint requiredStake = config.requiredStake();
        uint pricePerEpoch = config.pricePerEpoch();
        uint maxWorkersPerProvider = config.maxWorkersPerProvider();

        IWorkers workersController = deal.getWorkers();
        uint freeWorkerSlots = config.targetWorkers() - workersController.workersCount();

        bytes32 currentId = resourceConfigIds.first();
        while (currentId != ZERO && freeWorkerSlots > 0) {
            address resourceOwner = address(bytes20(currentId));

            ResourceConfig storage resourceConfig = resourceConfigs[resourceOwner];
            uint maxCollateral = resourceConfig.maxCollateral;

            if (
                resourceConfig.minPriceByEpoch > pricePerEpoch ||
                maxCollateral < requiredStake ||
                !_isEffectorsMatched(config, resourceOwner)
            ) {
                currentId = resourceConfigIds.next(currentId);
                continue;
            }

            uint totalJoinedWorkers = _joinDeal(
                controller,
                workersController,
                resourceOwner,
                maxCollateral,
                resourceConfig.workersCount,
                requiredStake,
                maxWorkersPerProvider,
                freeWorkerSlots
            );
            freeWorkerSlots -= totalJoinedWorkers;

            currentId = resourceConfigIds.next(currentId);
        }
    }
}
