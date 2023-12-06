// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

import "src/utils/OwnableUpgradableDiamond.sol";
import "src/deal/Deal.sol";

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
        uint256 epochDuration_,
        Deal dealImpl_,
        address fluenceToken_,
        uint256 fltPrice_,
        uint256 minDepositedEpoches_,
        uint256 minRematchingEpoches_,
        uint256 usdCollateralPerUnit_,
        uint256 usdTargetRevenuePerEpoch_,
        uint256 minDuration_,
        uint256 minRewardPerEpoch_,
        uint256 maxRewardPerEpoch_,
        uint256 vestingDuration_,
        uint256 slashingRate_,
        uint256 minRequierdProofsPerEpoch_,
        uint256 maxProofsPerEpoch_,
        uint256 withdrawEpochesAfterFailed_,
        uint256 maxFailedRatio_
    ) public initializer {
        __Ownable_init(msg.sender);
        __EpochController_init(epochDuration_);
        __DealFactory_init(dealImpl_);
        __GlobalConst_init(
            fluenceToken_,
            fltPrice_,
            minDepositedEpoches_,
            minRematchingEpoches_,
            usdCollateralPerUnit_,
            usdTargetRevenuePerEpoch_,
            minDuration_,
            minRewardPerEpoch_,
            maxRewardPerEpoch_,
            vestingDuration_,
            slashingRate_,
            minRequierdProofsPerEpoch_,
            maxProofsPerEpoch_,
            withdrawEpochesAfterFailed_,
            maxFailedRatio_
        );
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
