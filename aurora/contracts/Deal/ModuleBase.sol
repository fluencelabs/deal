// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "./interfaces/ICore.sol";

contract ModuleBase is UUPSUpgradeable {
    function _authorizeUpgrade(address newImplementation) internal override {}

    function _core() internal view returns (ICore) {
        return ICore(msg.sender);
    }

    uint256[50] private __gap;
}
