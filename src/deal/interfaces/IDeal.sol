// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IConfig.sol";
import "./IWorkerManager.sol";
import "src/core/interfaces/ICore.sol";

interface IDeal is IConfig, IWorkerManager {
    // ------------------ Types ------------------
    enum Status {
        INSUFFICIENT_FUNDS,
        ACTIVE,
        ENDED,
        NOT_ENOUGH_WORKERS
    }

    // ----------------- Events -----------------
    /// @dev Emitted when a owner deposits payment token to the deal
    event Deposited(uint256 amount);

    /// @dev Emitted when a owner withdraws payment token from the deal
    event Withdrawn(uint256 amount);

    /// @dev Emitted when a compute unit withdraws rewards from the deal
    event RewardWithdrawn(bytes32 computeUnitId, uint256 reward);

    /// @dev Emitted when a max paid epoch is updated
    event MaxPaidEpochUpdated(uint256 maxPaidEpoch);

    /// @dev Emitted when a deal is ended. This event can be emitted in the not-ended epoch. It can be emitted after the ended epoch in any epoch
    event DealEnded(uint256 endedEpoch);

    // ------------------ Init ------------------
    function initialize(
        ICore globalCore_,
        CIDV1 calldata appCID_,
        IERC20 paymentToken_,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 pricePerWorkerEpoch_,
        CIDV1[] calldata effectors_,
        AccessType providersAccessType_,
        address[] calldata providersAccessList_,
        uint256 protocolVersion_
    ) external;

    // ------------------ Public Ownable Functions ------------------
    /// @dev Deposits payment token to the deal
    function deposit(uint256 amount) external;

    /// @dev Withdraws payment token from the deal
    function withdraw(uint256 amount) external;

    // ------------------ Public View Functions ------------------
    /// @dev Returns the status of the deal
    function getStatus() external view returns (Status);

    /// @dev Returns the free balance of the deal
    function getFreeBalance() external view returns (uint256);

    /// @dev Returns the reward amount by compute unit ID
    function getRewardAmount(bytes32 computeUnitId) external view returns (uint256);

    /// @dev Returns the max paid epoch
    function getMaxPaidEpoch() external view returns (uint256);

    /// @dev Returns the protocol version
    function getProtocolVersion() external view returns (uint256);

    // ------------------ Public Mutable Functions ------------------
    /// @dev Adds a compute unit to the deal
    /// @param computeProvider The compute provider address
    /// @param unitId The compute unit ID
    /// @param peerId The peer ID
    function addComputeUnit(address computeProvider, bytes32 unitId, bytes32 peerId) external;

    /// @dev Removes a compute unit from the deal
    function removeComputeUnit(bytes32 computeUnitId) external;

    /// @dev Withdraws rewards from the deal by compute unit ID
    function withdrawRewards(bytes32 computeUnitId) external;

    /// @dev Set worker ID for a compute unit. Compute unit can have only one worker ID
    function setWorker(bytes32 computeUnitId, bytes32 workerId) external;

    /// @dev Stop the deal
    function stop() external;
}
