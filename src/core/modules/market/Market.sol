// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/MulticallUpgradeable.sol";
import "src/core/interfaces/ICore.sol";
import "src/deal/interfaces/IDeal.sol";
import "./Matcher.sol";
import "./DealFactory.sol";
import "./interfaces/IMarket.sol";

contract Market is UUPSUpgradeable, MulticallUpgradeable, DealFactory, Matcher, IMarket {
    // ------------------ Initializer ------------------
    constructor(ICore core_) BaseModule(core_) {}

    function initialize() public initializer {
        __UUPSUpgradeable_init();
        __Multicall_init();
    }

    function _authorizeUpgrade(address) internal override onlyCoreOwner {}

    // fallback() external {
    //     revert("Fallback not supported");
    // }
}
