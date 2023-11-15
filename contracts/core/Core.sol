// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "../utils/OwnableUpgradableDiamond.sol";
import "../deal/Deal.sol";
import "./Market.sol";
import "./DealFactory.sol";
import "./EpochController.sol";
import "./GlobalConst.sol";
import "./Matcher.sol";
import "./interfaces/ICore.sol";

contract Core is DealFactory, Matcher, UUPSUpgradeable, ICore {
    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.core.storage.v1")) - 1);

    // ------------------ Constructor ------------------
    // @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // ------------------ Initializer ------------------
    function initialize(
        address fluenceToken_,
        uint epochDuration_,
        uint minDepositedEpoches_,
        uint minRematchingEpoches_,
        Deal dealImpl_
    ) public initializer {
        __Ownable_init(msg.sender);
        __GlobalConst_init(fluenceToken_, minDepositedEpoches_, minRematchingEpoches_);
        __EpochController_init(epochDuration_);
        __DealFactory_init(dealImpl_);
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
