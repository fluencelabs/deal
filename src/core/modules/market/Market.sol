// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;


import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "src/core/interfaces/ICore.sol";
import "src/deal/interfaces/IDeal.sol";
import "./Matcher.sol";
import "./DealFactory.sol";
import "./interfaces/IMarket.sol";

contract Market is UUPSUpgradeable, DealFactory, Matcher, IMarket {
    // ------------------ Initializer ------------------
    constructor(IERC20 fluenceToken_, ICore core_) BaseModule(fluenceToken_, core_) {}

    function initialize(IDeal dealImpl) public initializer {
        __DealFactory_init(dealImpl);
    }

    function _authorizeUpgrade(address) internal override onlyCoreOwner {}
}
