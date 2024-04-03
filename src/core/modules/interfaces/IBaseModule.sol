// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "src/core/interfaces/ICore.sol";

/// @dev Base module interface. This interface is used for all modules in the core contract
interface IBaseModule {
    /// @dev Returns the core contract address
    function core() external view returns (ICore);
}
