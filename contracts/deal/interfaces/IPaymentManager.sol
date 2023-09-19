// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "../base/Types.sol";
import "../../global/interfaces/IGlobalConfig.sol";

interface IPaymentManager {
    // ----------------- Types -----------------
    struct Particle {
        string air;
        string prevData;
        string params;
        string callResults;
    }

    struct ParticleResult {
        bool isValid;
        uint256 epoch;
        uint256 worketsCount;
        uint256 reward;
    }

    // ----------------- Events -----------------
    event DepositedToPaymentBalance(uint256 amount);
    event WithdrawnFromPaymentBalance(uint256 amount);

    event ParticleCommitted(bytes32 particleHash, uint256 epoch, uint256 workersCount, uint256 reward);

    event RewardWithdrawn(bytes32 computeUnitId, bytes32 particleHash, uint256 reward);

    // ------------------ Public Ownable Functions ------------------
    function depositToPaymentBalance(uint256 amount /*TODO: onlyOwner*/) external;

    function withdrawFromPaymentBalance(uint256 amount /*TODO: onlyOwner*/) external;

    // ------------------ Public View Functions ------------------
    function getPaymentBalance() external view returns (uint256);

    function getLockedBalance() external view returns (uint256);

    function getRewardAmount(bytes32 particleHash, bytes32 computeUnitId) external view returns (uint);

    // ------------------ Public Mutable Functions ------------------
    function commitParticle(Particle calldata particle, bytes32[] memory computeUnitIds) external;

    function withdrawReward(bytes32 computeUnitIds, bytes32[] calldata particlesHashes) external;
}
