pragma solidity ^0.8.17;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "../Factory/DealFactory.sol";
import { GlobalConfig } from "./GlobalConfig.sol";

contract MatcherState {
    struct ResourceOwner {
        uint minPriceByEpoch;
        uint maxCollateral;
    }

    struct ResourceOwners {
        address[] addresses;
    }

    GlobalConfig public globalConfig;
    Factory public factory;

    mapping(address => ResourceOwner) public resourceOwners;

    uint[] public minPrices;
    mapping(uint => ResourceOwners) public resourceOwnersByMinPrice;
}

contract Matcher is MatcherState, Initializable, UUPSUpgradeable {
    modifier onlyOwner() {
        require(msg.sender == globalConfig.owner(), "Only owner can call this function");
        _;
    }

    modifier onlyFactory() {
        require(msg.sender == address(factory), "Only factory can call this function");
        _;
    }

    function initialize(GlobalConfig globalConfig_, Factory factory_) public initializer {
        globalConfig = globalConfig_;
        factory = factory_;
    }

    function register(uint minPriceByEpoch, uint maxCollateral) external onlyOwner {
        globalConfig.fluenceToken().transferFrom(msg.sender, address(this), maxCollateral);
        resourceOwners[msg.sender] = ResourceOwner(minPriceByEpoch, maxCollateral);

        if (resourceOwnersByMinPrice[minPriceByEpoch].addresses.length == 0) {
            minPrices.push(minPriceByEpoch);
        } else {
            uint index = _binarySearch(minPriceByEpoch);
            minPrices[index] = minPriceByEpoch;
        }
    }

    function unregister() external onlyOwner {
        globalConfig.fluenceToken().transfer(msg.sender, resourceOwners[msg.sender].maxCollateral);
        delete resourceOwners[msg.sender];
    }

    function matchWithDeal(uint collateral, uint priceByEpoch) external onlyFactory {}

    function _binarySearch(uint value) internal view returns (uint) {
        uint left = 0;
        uint right = minPrices.length - 1;

        while (left < right) {
            if (minPrices[mid] == value) {
                return mid;
            } else if (value > minPrices[mid]) {
                right = mid;
            } else {
                left = mid;
            }
        }

        return left;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
