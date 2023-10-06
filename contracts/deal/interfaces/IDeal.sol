// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IConfig.sol";
import "./IWorkerManager.sol";
import "./IStatusController.sol";

interface IDeal is IConfig, IStatusController, IWorkerManager {
    // ----------------- Events -----------------
    event Deposited(uint256 amount);
    event Withdrawn(uint256 amount);

    event RewardWithdrawn(bytes32 computeUnitId, uint256 reward);

    // ------------------ Init ------------------
    function initialize(
        IERC20 paymentToken_,
        uint256 collateralPerWorker_,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 pricePerWorkerEpoch_,
        CIDV1[] calldata effectors_,
        IConfig.AccessType accessType_,
        address[] calldata accessList_,
        address owner_
    ) external;

    // ------------------ Public Ownable Functions ------------------
    function deposit(uint256 amount) external;

    function withdraw(uint256 amount) external;

    // ------------------ Public View Functions ------------------
    function getFreeBalance() external view returns (uint256);

    function getRewardAmount(bytes32 computeUnitId) external view returns (uint);

    // ------------------ Public Mutable Functions ------------------
    function withdrawRewards(bytes32 computeUnitId) external;
}
