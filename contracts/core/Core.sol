// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "../utils/OwnableUpgradableDiamond.sol";
import "./MarketOffer.sol";
import "./DealFactory.sol";
import "./EpochController.sol";
import "./GlobalConstants.sol";
import "./Matcher.sol";

contract Core is Matcher, MarketOffer, DealFactory, EpochController, GlobalConstants, UUPSUpgradeable, OwnableUpgradableDiamond {
    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.market.storage.v1")) - 1);

    // ------------------ Constructor ------------------
    // @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // ------------------ Initializer ------------------
    function initialize(address fluenceToken_, uint epochDuration_, uint minDepositForNewDeal_, IDeal dealImpl_) public initializer {
        __Ownable_init(msg.sender);
        __GlobalConstants_init(fluenceToken_, minDepositForNewDeal_);
        __EpochController_init(epochDuration_);
        __DealFactory_init(dealImpl_);
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
