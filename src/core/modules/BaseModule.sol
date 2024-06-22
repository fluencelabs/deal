// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "src/utils/OwnableUpgradableDiamond.sol";
import "./interfaces/IBaseModule.sol";

contract BaseModule is IBaseModule {
    ICore public immutable core;

    // ------------------ Initializer ------------------
    constructor(ICore core_) {
        core = core_;
    }

    // ------------------ Modifiers ------------------
    modifier onlyCoreOwner() {
        require(OwnableUpgradableDiamond(address(core)).owner() == msg.sender, "BaseModule: caller is not the owner");
        _;
    }

    function owner() public view returns (address) {
        return OwnableUpgradableDiamond(address(core)).owner();
    }
}
