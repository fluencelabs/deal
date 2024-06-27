// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {ICapacityConst} from "src/core/interfaces/ICapacityConst.sol";


interface ICapacityConstWithPublicInternals is ICapacityConst {
    function setActiveUnitCount(uint256 activeUnitCount_) external;
    function init(CapacityConstInitArgs memory initArgs) external;
}
