// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IConfig.sol";
import "./IWorkerManager.sol";
import "./IStatusController.sol";

interface IDeal is IConfig, IStatusController, IWorkerManager {
    // ----------------- Events -----------------
    event DepositedToPaymentBalance(uint256 amount);
    event WithdrawnFromPaymentBalance(uint256 amount);

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
    function depositToPaymentBalance(uint256 amount) external;

    function withdrawFromPaymentBalance(uint256 amount) external;

    // ------------------ Public View Functions ------------------
    function getFreeBalance() external view returns (uint256);

    function getRewardAmount(bytes32 computeUnitId) external view returns (uint);

    // ------------------ Public Mutable Functions ------------------
    function withdrawReward(bytes32 computeUnitId) external;
}
