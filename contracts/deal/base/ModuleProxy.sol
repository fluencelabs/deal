// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "@openzeppelin/contracts/utils/StorageSlot.sol";
import "./Types.sol";
import "../interfaces/ICore.sol";

contract ModuleProxy is ERC1967Proxy {
    bytes32 private constant _CORE_SLOT = keccak256("network.fluence.proxy.core");

    constructor(address _logic, bytes memory _data, address _core) ERC1967Proxy(_logic, _data) {
        _setCore(_core);
    }

    function _setCore(address _core) internal {
        StorageSlot.getAddressSlot(_CORE_SLOT).value = _core;
    }

    function _getCore() internal view returns (address) {
        return StorageSlot.getAddressSlot(_CORE_SLOT).value;
    }
}
