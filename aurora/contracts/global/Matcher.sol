// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "../deal/interfaces/ICore.sol";
import "./interfaces/IGlobalConfig.sol";
import "./interfaces/IMatcher.sol";
import "../utils/LinkedList.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MatcherState {
    struct ResourceConfig {
        address owner;
        uint minPriceByEpoch;
        uint maxCollateral;
        uint workersCount;
    }

    IGlobalConfig public immutable globalConfig;

    LinkedList.Bytes32List public resourceConfigIds;
    mapping(address => ResourceConfig) public resourceConfigs;
    mapping(address => bool) public whitelist;

    constructor(IGlobalConfig globalConfig_) {
        globalConfig = globalConfig_;
    }
}

contract Matcher is IMatcher, MatcherState, UUPSUpgradeable {
    using LinkedList for LinkedList.Bytes32List;

    modifier onlyOwner() {
        require(msg.sender == globalConfig.owner(), "Only owner can call this function");
        _;
    }

    constructor(IGlobalConfig globalConfig_) MatcherState(globalConfig_) {}

    function setWhiteList(address owner, bool hasAccess) external onlyOwner {
        whitelist[owner] = hasAccess;
    }

    function setConfig(uint minPriceByEpoch, uint maxCollateral, uint workersCount) external {
        address owner = msg.sender;
        require(resourceConfigs[owner].owner == address(0x00), "Only owner can call this function");
        require(whitelist[owner], "Only whitelisted can call this function");

        uint amount = maxCollateral * workersCount;
        ResourceConfig memory config = ResourceConfig({
            owner: owner,
            minPriceByEpoch: minPriceByEpoch,
            maxCollateral: maxCollateral,
            workersCount: workersCount
        });

        resourceConfigIds.push(bytes32(bytes20(owner)));
        resourceConfigs[owner] = config;

        globalConfig.fluenceToken().transferFrom(owner, address(this), amount);
    }

    function remove() external {
        address owner = msg.sender;
        ResourceConfig storage resourceConfig = resourceConfigs[msg.sender];

        require(resourceConfig.owner != address(0x00), "Only owner can call this function");

        uint amount = resourceConfig.maxCollateral * resourceConfig.workersCount;
        delete resourceConfigs[msg.sender];
        resourceConfigIds.remove(bytes32(bytes20(owner)));

        globalConfig.fluenceToken().transfer(msg.sender, amount);
    }

    function matchWithDeal(ICore deal) external {
        require(globalConfig.factory().isDeal(address(deal)), "Deal is not from factory");

        IController controller = deal.getController();
        IConfig config = deal.getConfig();

        uint requiredStake = config.requiredStake();
        uint pricePerEpoch = config.pricePerEpoch();
        uint maxWorkersPerProvider = config.maxWorkersPerProvider();

        uint free = config.targetWorkers() - deal.getWorkers().workersCount();

        uint totalJoinedWorkers = 0;

        bytes32 currentId = resourceConfigIds.first();
        while (currentId != NULL) {
            IWorkers workers = deal.getWorkers();
            ResourceConfig storage resourceConfig = resourceConfigs[address(bytes20(currentId))];
            uint workersCount = resourceConfig.workersCount;
            uint maxCollateral = resourceConfig.maxCollateral;
            address resourceOwner = resourceConfig.owner;

            require(resourceConfig.minPriceByEpoch <= pricePerEpoch, "Price per epoch is too high");
            require(maxCollateral >= requiredStake, "Required stake is too high");

            uint joinedWorkers;

            if (maxWorkersPerProvider > workersCount) {
                joinedWorkers = workersCount;
            } else {
                joinedWorkers = maxWorkersPerProvider;
            }

            uint currentFree = free - totalJoinedWorkers;
            if (joinedWorkers > currentFree) {
                joinedWorkers = currentFree;
            }
            totalJoinedWorkers += joinedWorkers;

            uint refoundByWorker = maxCollateral - requiredStake;
            for (uint j = 0; j < joinedWorkers; j++) {
                globalConfig.fluenceToken().approve(address(workers), requiredStake);
                controller.joinViaMatcher(resourceOwner);

                if (refoundByWorker > 0) {
                    globalConfig.fluenceToken().transfer(resourceOwner, refoundByWorker * joinedWorkers);
                }
            }

            uint newWorkersCount = workersCount - joinedWorkers;
            if (newWorkersCount == 0) {
                delete resourceConfigs[resourceOwner];
                resourceConfigIds.remove(bytes32(bytes20(resourceOwner)));
            } else {
                workersCount = newWorkersCount;
            }

            currentId = resourceConfigIds.next(currentId);
        }
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
