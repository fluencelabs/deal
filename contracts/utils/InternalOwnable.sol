// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

abstract contract InternalOwnable {
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    function owner() public view virtual returns (address);

    function _checkOwner() internal view virtual;

    function _transferOwnership(address newOwner) internal virtual;
}
