// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "src/core/modules/capacity/interfaces/ICapacity.sol";
import "src/core/modules/market/interfaces/IMarket.sol";

interface IGlobalConst {
    // ------------------ Events ------------------
    event ConstantUpdated(ConstantType constantType, uint256 newValue);

    // ------------------ Types ------------------
    enum ConstantType {
        MinDealDepositedEpoches,
        MinDealRematchingEpoches
    }

    // ------------------ External Constants ------------------
    function precision() external view returns (uint256);

    // ------------------ External View Functions ------------------
    function fluenceToken() external view returns (IERC20);

    function minDealDepositedEpoches() external view returns (uint256);
    function minDealRematchingEpoches() external view returns (uint256);

    // ------------------ External Mutable Functions ------------------
    function setConstant(ConstantType constantType, uint256 v) external;
}
