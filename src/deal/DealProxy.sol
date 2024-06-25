// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import {Proxy} from "@openzeppelin/contracts/proxy/Proxy.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {ICore} from "src/core/interfaces/ICore.sol";

contract DealProxy is Proxy {
    ICore immutable _diamond;

    constructor(ICore diamond_, bytes memory data_) {
        _diamond = diamond_;
        if (data_.length > 0) {
            Address.functionDelegateCall(address(diamond_.dealImpl()), data_);
        }
    }

    function _implementation() internal view override returns (address) {
        return address(_diamond.dealImpl());
    }
}
