pragma solidity ^0.8.17;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "../Utils/AVLTree.sol";
import { GlobalConfig } from "./GlobalConfig.sol";

contract MatcherState {
    struct ResourceOwner {
        uint minPriceByEpoch;
        uint maxCollateral;
    }

    struct ResouceByPrice {
        bool exists;
        address[] resourceOwners;
    }

    GlobalConfig public globalConfig;
    address public factory;

    mapping(address => ResourceOwner) public resourceOwners;

    uint[] public minPrices;
    mapping(uint => ResouceByPrice) public resourceOwnersByMinPrice;
}

contract Matcher is MatcherState, Initializable, UUPSUpgradeable {
    using AVLTree for AVLTree.Tree;

    AVLTree.Tree tree;

    modifier onlyOwner() {
        require(msg.sender == globalConfig.owner(), "Only owner can call this function");
        _;
    }

    modifier onlyFactory() {
        require(msg.sender == address(factory), "Only factory can call this function");
        _;
    }

    function initialize(GlobalConfig globalConfig_, address factory_) public initializer {
        globalConfig = globalConfig_;
        factory = factory_;
    }

    function register(uint64 minPriceByEpoch, uint maxCollateral) external onlyOwner {
        globalConfig.fluenceToken().transferFrom(msg.sender, address(this), maxCollateral);
        resourceOwners[msg.sender] = ResourceOwner(uint256(minPriceByEpoch), maxCollateral);

        if (resourceOwnersByMinPrice[minPriceByEpoch].exists) {
            resourceOwnersByMinPrice[minPriceByEpoch].resourceOwners.push(msg.sender);
        } else {
            resourceOwnersByMinPrice[minPriceByEpoch] = ResouceByPrice(true, new address[](0));
            tree.insert(minPriceByEpoch);
        }
    }

    function matchWithDeal(uint collateral, uint priceByEpoch) external onlyFactory {
        uint v = tree.searchGTE(priceByEpoch);

        require(v > 0, "No resource owners with min price >= priceByEpoch");

        for (uint i = 0; i < resourceOwnersByMinPrice[v].resourceOwners.length; i++) {
            address resourceOwner = resourceOwnersByMinPrice[v].resourceOwners[i];
            if (resourceOwners[resourceOwner].maxCollateral >= collateral) {
                // match v
            }
        }
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
