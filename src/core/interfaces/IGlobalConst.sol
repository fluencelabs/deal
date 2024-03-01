// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "src/core/modules/capacity/interfaces/ICapacity.sol";
import "src/core/modules/market/interfaces/IMarket.sol";

/// @title Global Constants contract interface
/// @dev Global Constants contract stores global constants of the system and it is responsible for changing them
interface IGlobalConst {
    // ------------------ Events ------------------
    /// @dev Emitted when a constant with uint256 value is updated
    /// @param constantType Constant type
    /// @param newValue New uint256 value
    event ConstantUpdated(ConstantType constantType, uint256 newValue);

    // ------------------ Types ------------------
    enum ConstantType {
        MinDealDepositedEpoches,
        MinDealRematchingEpoches,
        MinProtocolVersion,
        MaxProtocolVersion
    }

    // ------------------ External Constants ------------------
    /// @dev Returns precision for decimal values (USD, percentage)
    function precision() external view returns (uint256);

    // ------------------ External View Functions ------------------

    /// @dev Returns min deposited epoches constant for new deals
    /// @return min deposited epoches for new deals
    function minDealDepositedEpoches() external view returns (uint256);

    /// @dev Returns min rematching epoches constant for all deals
    /// @return min rematching epoches for all deals
    function minDealRematchingEpoches() external view returns (uint256);

    /// @dev Returns min protocol version which can be specified in offers and deals
    /// @return min protocol version
    function minProtocolVersion() external view returns (uint256);

    /// @dev Returns max protocol version which can be specified in offers and deals
    /// @return max protocol version
    function maxProtocolVersion() external view returns (uint256);

    // ------------------ External Mutable Functions ------------------
    /// @dev Sets constant with uint256 value
    /// @param constantType Constant type
    /// @param v New uint256 value
    function setConstant(ConstantType constantType, uint256 v) external;
}
