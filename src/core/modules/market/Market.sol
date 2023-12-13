// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "src/core/interfaces/ICore.sol";
import "src/deal/interfaces/IDeal.sol";
import "./Matcher.sol";
import "./DealFactory.sol";

contract Market is UUPSUpgradeable, DealFactory, Matcher {
    // ------------------ Initializer ------------------
    function initialize(ICore core, IDeal dealImpl) public initializer {
        __BaseModule_init(core);
        __DealFactory_init(dealImpl);
    }

    function _authorizeUpgrade(address) internal override onlyCoreOwner {}
}
