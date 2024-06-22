// SPDX-License-Identifier: Apache-2.0
// only for tests
pragma solidity ^0.8.19;

import "src/core/CapacityConst.sol";
import "./interfaces/ICapacityConstWithPublicInternals.sol";
import {LibCapacityConst} from "src/lib/LibCapacityConst.sol";

contract CapacityConstWithPublicInternals is ICapacityConstWithPublicInternals, CapacityConst {
    uint256 public constant EPOCH_DURATION = 1 days;

    function init(CapacityConstInitArgs memory args) public {
        // TODO DIAMOND
        // __EpochController_init(EPOCH_DURATION);
        // __Ownable_init(msg.sender);
        // __CapacityConst_init(args);
    }

    function setActiveUnitCount(uint256 activeUnitCount_) public {
        LibCapacityConst._setActiveUnitCount(activeUnitCount_);
    }
}
