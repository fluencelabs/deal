// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "src/core/modules/capacity/Capacity.sol";
import "src/core/modules/market/Market.sol";

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

    function test_Deal() external {
        vm.createSelectFork("https://ipc-stage.fluence.dev");
        Capacity cc = Capacity(0x8672221610858bE36c240a81cDC3BDa6f9FbC019);
        Market m = Market(0x351973727896b7B1EE5Ffc27De203A1EFdF091c6);
        vm.startPrank(0x2d088Ee84734642faa983382cCD1b75E9b49318e);
        Market newM = new Market(m.core());
        vm.etch(0x351973727896b7B1EE5Ffc27De203A1EFdF091c6, address(newM).code);
        Capacity newCc = new Capacity(cc.core());
        vm.etch(0x8672221610858bE36c240a81cDC3BDa6f9FbC019, address(newCc).code);
        bytes32[][] memory unitIds2D = new bytes32[][](1);
        unitIds2D[0] = new bytes32[](1);
        unitIds2D[0][0] = 0xb4d1315a4b35486e0a9c6dbdf7ae3d02f5b32611c8125777d0bde58f138b7cad;
        bytes32[] memory offers = new bytes32[](1);
        offers[0] = 0x5a9c683d5ba7774043e88ea6df62c23c6a0217776ff86dde6df1c505e2ca06d2;
        m.matchDeal(
            IDeal(0x5b27DAd5B3c91C97D98129A2Cc1f98d87e07Cb99),
            offers,
            unitIds2D
        );
    }

    function test_Deal2() external {
        vm.createSelectFork("https://ipc-stage.fluence.dev");
        // Capacity cc = Capacity(0x8672221610858bE36c240a81cDC3BDa6f9FbC019);
        Market m = Market(0x027c2fa9e0b24657B621b771E82E019949541191);
        vm.startPrank(0xAB9489E0d57df03b34F091552f7C849bA829097a);
        Market newM = new Market(m.core());
        vm.etch(0x027c2fa9e0b24657B621b771E82E019949541191, address(newM).code);
        // Capacity newCc = new Capacity(cc.core());
        // vm.etch(0x8672221610858bE36c240a81cDC3BDa6f9FbC019, address(newCc).code);
        vm.stopPrank();
        // vm.startPrank(0x2d088Ee84734642faa983382cCD1b75E9b49318e);
        // m.returnComputeUnitFromDeal(
        //     0x61e595ef1d847630c53b69f8686204b3971d279564d07830003db7e60594c25f
        // );
        // vm.stopPrank();
        vm.startPrank(0xAB9489E0d57df03b34F091552f7C849bA829097a);
        m.returnComputeUnitFromDeal(
            0x61e595ef1d847630c53b69f8686204b3971d279564d07830003db7e60594c25f
        );
    }
}
