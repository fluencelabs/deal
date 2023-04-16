pragma solidity ^0.8.17;

import "../deal/interfaces/ICore.sol";
import { GlobalConfig } from "./GlobalConfig.sol";

contract MatcherState {
    struct ResourceOwner {
        uint minPriceByEpoch;
        uint maxCollateral;
        uint workersCount;
    }
    GlobalConfig public globalConfig;

    mapping(address => ResourceOwner) public resourceOwners;
    mapping(address => uint) public collateral;
}

contract Matcher is MatcherState, Initializable, UUPSUpgradeable {
    modifier onlyOwner() {
        require(msg.sender == globalConfig.owner(), "Only owner can call this function");
        _;
    }

    function initialize(GlobalConfig globalConfig_) public initializer {
        globalConfig = globalConfig_;
    }

    function register(uint64 minPriceByEpoch, uint maxCollateral, uint workersCount) external onlyOwner {
        uint amount = maxCollateral * workersCount;
        globalConfig.fluenceToken().transferFrom(msg.sender, address(this), amount);
        resourceOwners[msg.sender] = ResourceOwner(uint256(minPriceByEpoch), maxCollateral, workersCount);
    }

    function matchWithDeal(ICore deal, address[] calldata resources) external {
        IController controller = deal.getController();
        IConfig config = deal.getConfig();

        uint requiredStake = config.requiredStake();
        uint pricePerEpoch = config.pricePerEpoch();
        for (uint i = 0; i < resources.length; i++) {
            address resource = resources[i];

            ResourceOwner storage resourceOwner = resourceOwners[resource];
            require(resourceOwner.minPriceByEpoch <= pricePerEpoch, "Price per epoch is too high");
            require(resourceOwner.maxCollateral >= requiredStake, "Required stake is too high");
            //    require(config.workers() <= resource.workersCount, "Not enough workers");

            globalConfig.fluenceToken().approve(address(deal), requiredStake);
            controller.joinViaMatcher(resource);

            uint refound = resourceOwner.maxCollateral - requiredStake;
            if (refound > 0) {
                globalConfig.fluenceToken().transfer(resource, refound);
            }

            uint workersCount = resourceOwner.workersCount;
            if (workersCount == 1) {
                delete resourceOwners[resource];
            } else {
                resourceOwner.workersCount = workersCount - 1;
            }
        }
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
