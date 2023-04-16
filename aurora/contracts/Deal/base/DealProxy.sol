// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "../Core.sol";
import "./Types.sol";

contract DealProxy is ERC1967Proxy {
    bytes32 internal constant _CORE_SLOT = keccak256("network.fluence.deal.core");

    constructor(address implementation_, bytes memory data_, Core core_) ERC1967Proxy(implementation_, data_) {
        StorageSlot.getAddressSlot(_CORE_SLOT).value = address(core_);
    }

    function _fallback() internal override {
        Core core = Core(_getCore());
        require(msg.sender == _getCore() || core.moduleByAddress(msg.sender) == Module.None, "Only core or modules can call");

        super._fallback();
    }

    function _getCore() internal view returns (address) {
        return StorageSlot.getAddressSlot(_CORE_SLOT).value;
    }
}
