// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "src/core/interfaces/ICapacityConst.sol";

interface ICapacityConstWithPublicInternals is ICapacityConst {
    function init(CapacityConstInitArgs memory args) external;

    function setActiveUnitCount(uint256 activeUnitCount_) external;
}
