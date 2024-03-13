// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "./IGlobalConst.sol";
import "./IEpochController.sol";
import "src/core/modules/capacity/interfaces/ICapacity.sol";
import "src/core/modules/market/interfaces/IMarket.sol";
import "src/core/modules/market/interfaces/IDealFactory.sol";
import "src/deal/interfaces/IDeal.sol";

/// @title Core contract interface
/// @dev Core contract is the main contract of the system and it is responsible for navigation between modules
interface ICore is IEpochController, IGlobalConst {
    event DealImplSet(IDeal dealImpl);

    // ------------------ Initializer ------------------

    /// @dev initializes the contract
    /// @param epochDuration_ Epoch duration in seconds
    /// @param minDepositedEpochs_ Min deposited Epochs constant for new deals
    /// @param minRematchingEpochs_ Min rematching Epochs constant for all deals
    /// @param dealImpl_ Deal implementation contract address
    function initialize(
        uint256 epochDuration_,
        uint256 minDepositedEpochs_,
        uint256 minRematchingEpochs_,
        uint256 minProtocolVersion_,
        uint256 maxProtocolVersion_,
        IDeal dealImpl_,
        bool isWhitelistEnabled_
    ) external;

    /// @dev Sets modules
    /// @param capacity Capacity module address
    /// @param market Market module address
    function initializeModules(ICapacity capacity, IMarket market, IDealFactory dealFactory) external;

    // ------------------ External View Functions ------------------
    /// @dev Returns capacity module
    /// @return capacity module address
    function capacity() external view returns (ICapacity);

    /// @dev Returns market module
    /// @return market module address
    function market() external view returns (IMarket);

    function dealImpl() external view returns (IDeal);

    // ------------------ External Mutable Functions ------------------
    function setDealImpl(IDeal dealImpl_) external;
}
