// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "src/dev/tFLT.sol";
import "forge-std/Script.sol";

contract DeployTflt is Script {
  function run() external {
    vm.startBroadcast();
    new tFLT();
  }
}
