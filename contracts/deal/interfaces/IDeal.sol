// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "./IPaymentManager.sol";
import "./IWorkerManager.sol";

interface IDeal is IPaymentManager, IWorkerManager {}
