// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "src/utils/OwnableUpgradableDiamond.sol";
import "./IBaseModule.sol";

contract BaseModule is Initializable, IBaseModule {
    ICore public immutable core;
    IERC20 public immutable fluenceToken;

    // ------------------ Initializer ------------------
    constructor(IERC20 fluenceToken_, ICore core_) {
        fluenceToken = fluenceToken_;
        core = core_;
        _disableInitializers();
    }

    // ------------------ Modifiers ------------------
    modifier onlyCoreOwner() {
        require(OwnableUpgradableDiamond(address(core)).owner() == msg.sender, "BaseModule: caller is not the owner");
        _;
    }

    modifier onlyMarket() {
        require(address(core.market()) == msg.sender, "BaseModule: caller is not the market");
        _;
    }

    modifier onlyCapacity() {
        require(address(core.capacity()) == msg.sender, "BaseModule: caller is not the capacity");
        _;
    }
}
