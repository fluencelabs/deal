// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "./IGlobalConst.sol";
import "./IEpochController.sol";
import "src/core/modules/capacity/interfaces/ICapacity.sol";
import "src/core/modules/market/interfaces/IMarket.sol";

interface ICore is IEpochController, IGlobalConst {
    // ------------------ Initializer ------------------
    function initialize(
        uint256 epochDuration_,
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
    ) external;
    function initializeModules(ICapacity capacity, IMarket market) external;

    // ------------------ External View Functions ------------------
    function capacity() external view returns (ICapacity);
    function market() external view returns (IMarket);

    // ------------------ External Mutable Functions ------------------
    function addCCActiveUnitCount() external;
    function subCCActiveUnitCount() external;
}
