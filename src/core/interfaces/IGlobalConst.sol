// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "src/core/modules/capacity/interfaces/ICapacity.sol";
import "src/core/modules/market/interfaces/IMarket.sol";

interface IGlobalConst {
    // ------------------ Events ------------------
    event FLTPriceUpdated(uint256 newPrice);
    event DealConstantUpdated(DealConstantType constantType, uint256 newValue);
    event CCConstantUpdated(CCConstantType constantType, uint256 newValue);

    // ------------------ Types ------------------
    enum DealConstantType {
        MinDepositedEpoches,
        MinRematchingEpoches
    }

    enum CCConstantType {
        USDCollateralPerUnit,
        USDTargetRevenuePerEpoch,
        MinDuration,
        MinRewardPerEpoch,
        MaxRewardPerEpoch,
        VestingDuration,
        SlashingRate,
        MinRequierdProofsPerEpoch,
        MaxProofsPerEpoch,
        WithdrawEpochesAfterFailed,
        MaxFailedRatio
    }

    // ------------------ External Constants ------------------
    function PRECISION() external view returns (uint256);

    // ------------------ External View Functions ------------------
    function fluenceToken() external view returns (address);
    function fltPrice() external view returns (uint256);

    // deal constants
    function minDealDepositedEpoches() external view returns (uint256);
    function minDealRematchingEpoches() external view returns (uint256);

    // cc constants
    function fltCCCollateralPerUnit() external view returns (uint256);
    function usdCCCollateralPerUnit() external view returns (uint256);
    function fltCCTargetRevenuePerEpoch() external view returns (uint256);
    function usdCCTargetRevenuePerEpoch() external view returns (uint256);
    function minCCDuration() external view returns (uint256);
    function minCCRewardPerEpoch() external view returns (uint256);
    function maxCCRewardPerEpoch() external view returns (uint256);
    function ccVestingDuration() external view returns (uint256);
    function ccSlashingRate() external view returns (uint256);
    function minCCRequierdProofsPerEpoch() external view returns (uint256);
    function maxCCProofsPerEpoch() external view returns (uint256);
    function ccWithdrawEpochesAfterFailed() external view returns (uint256);
    function ccMaxFailedRatio() external view returns (uint256);
    function ccActiveUnitCount() external view returns (uint256);
    function getCCRewardPool(uint256 epoch) external view returns (uint256);

    // ------------------ External Mutable Functions ------------------
    function setFLTPrice(uint256 fltPrice_) external;
    function setDealConstant(DealConstantType constantType, uint256 v) external;
    function setCCConstant(CCConstantType constantType, uint256 v) external;
}
