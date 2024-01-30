// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/proxy/Proxy.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "src/core/interfaces/ICore.sol";

contract DealProxy is Proxy {
    ICore immutable _core;

    constructor(ICore core_, bytes memory data_) {
        _core = core_;
        if (data_.length > 0) {
            Address.functionDelegateCall(address(core_.dealImpl()), data_);
        }
    }

    function _implementation() internal view override returns (address) {
        return address(_core.dealImpl());
    }
}
