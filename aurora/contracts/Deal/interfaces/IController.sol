// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

interface IController {
    function initialize() external;

    function owner() external view returns (address);

    function setAppCID(string calldata cid) external;

    function join() external;

    function joinViaMatcher(address resourceOwner) external;

    function transferOwnership(address newOwner) external;
}
