// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "src/core/interfaces/ICore.sol";

/// @dev Base module interface. This interface is used for all modules in the core contract
interface IBaseModule {
    /// @dev Returns the core contract address
    function core() external view returns (ICore);

    /// @dev Returns the fluence token address
    function fluenceToken() external view returns (IERC20);
}
