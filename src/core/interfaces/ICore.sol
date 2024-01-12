// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "./IGlobalConst.sol";
import "./IEpochController.sol";
import "src/core/modules/capacity/interfaces/ICapacity.sol";
import "src/core/modules/market/interfaces/IMarket.sol";

interface ICore is IEpochController, IGlobalConst {
    // ------------------ Initializer ------------------
    function initialize(uint256 epochDuration_, uint256 minDepositedEpoches_, uint256 minRematchingEpoches_) external;
    function initializeModules(ICapacity capacity, IMarket market) external;

    // ------------------ External View Functions ------------------
    function capacity() external view returns (ICapacity);
    function market() external view returns (IMarket);
}
