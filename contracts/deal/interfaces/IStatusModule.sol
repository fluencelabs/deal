// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

enum DealStatus {
    WaitingForWorkers,
    Working
}

interface IStatusModule {
    event StatusChanged(DealStatus newStatus);

    function status() external view returns (DealStatus);

    function startWorkingEpoch() external view returns (uint256);

    function changeStatus(DealStatus status_) external;
}
