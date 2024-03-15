// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "src/utils/OwnableUpgradableDiamond.sol";
import "./IBaseModule.sol";

contract BaseModule is Initializable, IBaseModule {
    ICore public immutable core;

    // ------------------ Initializer ------------------
    constructor(ICore core_) {
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

    function owner() public view returns (address) {
        return OwnableUpgradableDiamond(address(core)).owner();
    }
}
