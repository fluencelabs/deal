// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

import "src/core/interfaces/ICore.sol";
import "src/core/interfaces/ICapacityConst.sol";
import "src/core/modules/capacity/interfaces/ICapacity.sol";
import "src/core/modules/market/interfaces/IMarket.sol";
import "src/core/modules/market/interfaces/IDealFactory.sol";
import "src/deal/interfaces/IDeal.sol";

abstract contract TestWithDeployment is Test {
    // ------------------ Types ------------------
    struct Deployment {
        bool initialized;
        IERC20 tUSD;
        IDeal dealImpl;
        ICore core;
        IMarket market;
        ICapacity capacity;
        IDealFactory dealFactory;
    }

    // ------------------ Variables ------------------
    Deployment public deployment;

    function setUp() public virtual {
        _deploy();
    }

    function _deploy() internal virtual;
}
