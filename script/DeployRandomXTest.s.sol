// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "src/RandomXTest.sol";


contract DeployRandomXTest is Script {
  // 0xF7dfBB5D428C06e091F1d2C87fCB0e119AC10A43
  function run() external {
    vm.startBroadcast();
    // console.log(address().balance());
    new RandomXTest();

  }
}
