// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "./IGlobalConst.sol";
import "./IEpochController.sol";
import "src/core/modules/capacity/interfaces/ICapacity.sol";
import "src/core/modules/market/interfaces/IMarket.sol";

/// @title Core contract interface
/// @dev Core contract is the main contract of the system and it is responsible for navigation between modules
interface ICore is IEpochController, IGlobalConst {
    // ------------------ Initializer ------------------

    /// @dev initializes the contract
    /// @param epochDuration_ Epoch duration in seconds
    /// @param minDepositedEpoches_ Min deposited epoches constant for new deals
    /// @param minRematchingEpoches_ Min rematching epoches constant for all deals
    function initialize(uint256 epochDuration_, uint256 minDepositedEpoches_, uint256 minRematchingEpoches_) external;

    /// @dev Sets modules
    /// @param capacity Capacity module address
    /// @param market Market module address
    function initializeModules(ICapacity capacity, IMarket market) external;

    // ------------------ External View Functions ------------------
    /// @dev Returns capacity module
    /// @return capacity module address
    function capacity() external view returns (ICapacity);

    /// @dev Returns market module
    /// @return market module address
    function market() external view returns (IMarket);
}
