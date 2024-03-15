// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "src/core/modules/capacity/interfaces/ICapacity.sol";
import "src/core/modules/market/interfaces/IMarket.sol";
import "./ICapacityConst.sol";

/// @title Global Constants contract interface
/// @dev Global Constants contract stores global constants of the system and it is responsible for changing them
interface IGlobalConst is ICapacityConst {
    // ------------------ Events ------------------
    /// @dev Emitted when a constant with uint256 value is updated
    /// @param constantType Constant type
    /// @param newValue New uint256 value
    event ConstantUpdated(ConstantType constantType, uint256 newValue);

    // ------------------ Types ------------------
    enum ConstantType {
        MinDealDepositedEpochs,
        MinDealRematchingEpochs,
        MinProtocolVersion,
        MaxProtocolVersion
    }

    // ------------------ External Constants ------------------
    /// @dev Returns precision for decimal values (USD, percentage)
    function precision() external view returns (uint256);

    // ------------------ External View Functions ------------------

    /// @dev Returns min deposited Epochs constant for new deals
    /// @return min deposited Epochs for new deals
    function minDealDepositedEpochs() external view returns (uint256);

    /// @dev Returns min rematching Epochs constant for all deals
    /// @return min rematching Epochs for all deals
    function minDealRematchingEpochs() external view returns (uint256);

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
