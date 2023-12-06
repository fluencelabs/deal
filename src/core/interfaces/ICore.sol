// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "./IGlobalConst.sol";
import "./IEpochController.sol";
import "./IMarket.sol";

interface ICore is IEpochController, IGlobalConst, IMarket {}
