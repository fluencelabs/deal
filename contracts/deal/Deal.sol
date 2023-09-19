// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "./PaymentManager.sol";
import "./WorkerManager.sol";
import "./interfaces/IDeal.sol";

contract Deal is WorkerManager, PaymentManager, IDeal {
    // ------------------ Constructor ---------------------
    constructor(IGlobalConfig globalConfig_) Config(globalConfig_) {}
}
