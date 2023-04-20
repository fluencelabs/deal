// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

interface IFactory {
    function isDeal(address addr) external view returns (bool);

    function createDeal(uint256 minWorkers_, uint256 targetWorkers_, string memory appCID_) external returns (address);
}
