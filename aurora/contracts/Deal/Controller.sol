// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "./interfaces/IController.sol";
import "./ModuleBase.sol";

contract Controller is ModuleBase, IController {}
