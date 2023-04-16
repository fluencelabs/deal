// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/StorageSlot.sol";
import "../base/Types.sol";

interface IWorkers {
    function getNextWorkerIndex() external view returns (uint256);

    function getPATIndex(PATId id) external view returns (uint256);

    function getPATOwner(PATId id) external view returns (address);

    function getUnlockedAmountBy(address owner, uint256 timestamp) external view returns (uint256);

    function createPAT(address owner) external;

    function removePAT(PATId id) external;

    function withdraw(address owner) external;
}
