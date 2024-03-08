// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "src/core/modules/capacity/Capacity.sol";

contract ProofsTest is Test {
    function test_Fork() external {
        vm.createSelectFork("https://ipc-stage.fluence.dev");
        Capacity cc = Capacity(0x8672221610858bE36c240a81cDC3BDa6f9FbC019);
        vm.startPrank(0xAB9489E0d57df03b34F091552f7C849bA829097a);
        Capacity newCc = new Capacity(cc.core());
        vm.etch(0x8672221610858bE36c240a81cDC3BDa6f9FbC019, address(newCc).code);
        cc.submitProof(
            0xb4d1315a4b35486e0a9c6dbdf7ae3d02f5b32611c8125777d0bde58f138b7cad,
            0xd0f33c42ea0460546bd6ea6ceb8f7ebcd8337efe341749739b2770d132dda768,
            0x0000a20888b66c8e726643750ce200cd0f85c835b22f73ac9f10cc76412a2921
        );
    }
}
