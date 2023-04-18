// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "../deal/interfaces/ICore.sol";
import "./interfaces/IGlobalConfig.sol";
import "./interfaces/IMatcher.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MatcherState {
    struct ResourceOwner {
        uint minPriceByEpoch;
        uint maxCollateral;
        uint workersCount;
    }
    IGlobalConfig public immutable globalConfig;

    mapping(address => ResourceOwner) public resourceOwners;
    mapping(address => uint) public collateral;

    constructor(IGlobalConfig globalConfig_) {
        globalConfig = globalConfig_;
    }
}

contract Matcher is IMatcher, MatcherState, UUPSUpgradeable {
    modifier onlyOwner() {
        require(msg.sender == globalConfig.owner(), "Only owner can call this function");
        _;
    }

    constructor(IGlobalConfig globalConfig_) MatcherState(globalConfig_) {}

    function register(uint64 minPriceByEpoch, uint maxCollateral, uint workersCount) external onlyOwner {
        uint amount = maxCollateral * workersCount;
        globalConfig.fluenceToken().transferFrom(msg.sender, address(this), amount);
        resourceOwners[msg.sender] = ResourceOwner(uint256(minPriceByEpoch), maxCollateral, workersCount);
    }

    function matchWithDeal(ICore deal, address[] calldata resources, uint[] calldata workersCount_) external {
        require(globalConfig.factory().isDeal(address(deal)), "Deal is not from factory");

        IController controller = deal.getController();
        IConfig config = deal.getConfig();

        uint requiredStake = config.requiredStake();
        uint pricePerEpoch = config.pricePerEpoch();
        uint maxWorkersPerProvider = config.maxWorkersPerProvider();

        uint free = config.targetWorkers() - deal.getWorkers().workersCount();

        uint totalJoinedWorkers = 0;

        address dealAddress = address(deal);
        for (uint i = 0; i < resources.length; i++) {
            address resource = resources[i];
            uint joinedWorkers = workersCount_[i];

            ResourceOwner memory resourceOwner = resourceOwners[resource];
            require(resourceOwner.minPriceByEpoch <= pricePerEpoch, "Price per epoch is too high");
            require(resourceOwner.maxCollateral >= requiredStake, "Required stake is too high");
            require(resourceOwner.workersCount >= joinedWorkers, "Required stake is too high");
            require(maxWorkersPerProvider <= joinedWorkers, "Max workers per provider reached");

            totalJoinedWorkers += joinedWorkers;
            require(totalJoinedWorkers <= free, "Max workers count reached");

            uint refoundByWorker = resourceOwner.maxCollateral - requiredStake;
            for (uint j = 0; j < joinedWorkers; j++) {
                globalConfig.fluenceToken().approve(dealAddress, requiredStake);
                controller.joinViaMatcher(resource);
            }

            if (refoundByWorker > 0) {
                globalConfig.fluenceToken().transfer(resource, refoundByWorker * joinedWorkers);
            }

            uint newWorkersCount = resourceOwner.workersCount - joinedWorkers;
            if (newWorkersCount == 0) {
                delete resourceOwners[resource];
            } else {
                resourceOwner.workersCount = newWorkersCount;
            }
        }
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
