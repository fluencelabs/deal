// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "./base/Types.sol";
import "./Config.sol";
import "./interfaces/IPaymentManager.sol";
import "./WorkerInfoInternal.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";

abstract contract PaymentManager is Config, WorkerInfoInternal, IPaymentManager {
    using BitMaps for BitMaps.BitMap;
    using SafeERC20 for IERC20;

    // ------------------ Private Vars ------------------
    uint256 private _totalBalance;
    uint256 private _lockedBalance;

    mapping(uint => uint) private _goldenParticleCountByEpoch;
    mapping(bytes32 => ParticleResult) private _particleResults;
    mapping(uint => mapping(uint => uint)) private _workersByEpoch;
    mapping(bytes32 => BitMaps.BitMap) private _paidWorkersByParticle;

    // ------------------ Privat Functions ------------------

    function _freeBalance() private view returns (uint256) {
        return _totalBalance - _lockedBalance;
    }

    function _hasWorkerInEpoch(uint epoch, bytes32 computeUnitId) private view returns (bool) {
        uint index = _getComputeUnit(computeUnitId).index;
        uint256 bucket = index >> 8;
        uint256 mask = 1 << (index & 0xff);
        if (_workersByEpoch[epoch][bucket] & mask == 0) {
            return false;
        }

        return true;
    }

    // ------------------ Public Ownable Functions ------------------
    function depositToPaymentBalance(uint256 amount) external /*TODO: onlyOwner*/ {
        paymentToken().safeTransferFrom(msg.sender, address(this), amount);
        _totalBalance += amount;

        emit DepositedToPaymentBalance(amount);
    }

    function withdrawFromPaymentBalance(uint256 amount) external /*TODO: onlyOwner*/ {
        require(_freeBalance() >= amount, "Not enough free balance");

        _totalBalance -= amount;
        paymentToken().safeTransfer(msg.sender, amount);

        emit WithdrawnFromPaymentBalance(amount);
    }

    // ------------------ Public View Functions ------------------
    function getPaymentBalance() public view returns (uint256) {
        return _totalBalance - _lockedBalance;
    }

    function getLockedBalance() external view returns (uint256) {
        return _lockedBalance;
    }

    function getRewardAmount(bytes32 particleHash, bytes32 computeUnitId) public view returns (uint) {
        ParticleResult storage particleResults = _particleResults[particleHash];

        require(particleResults.isValid, "Particle not valid");

        uint currentEpoch = globalConfig().epochManager().currentEpoch();
        uint particleEpoch = particleResults.epoch;

        require(currentEpoch - 1 > particleEpoch, "Particle not confirmed");

        if (!_hasWorkerInEpoch(particleEpoch, computeUnitId) || !_hasWorkerInEpoch(particleEpoch - 1, computeUnitId)) {
            return 0;
        }

        return particleResults.reward / particleResults.worketsCount;
    }

    // ------------------ Public Mutable Functions ------------------
    function commitParticle(Particle calldata particle, bytes32[] memory computeUnitIds) external {
        // check particle
        bytes32 particleHash = keccak256(abi.encode(particle.air, particle.prevData, particle.params, particle.callResults));
        require(_particleResults[particleHash].epoch == 0, "Particle already exists");

        // check computeUnitIds
        uint epoch = globalConfig().epochManager().currentEpoch();
        for (uint i = 0; i < computeUnitIds.length; i++) {
            uint index = _getComputeUnit(computeUnitIds[i]).index;
            uint256 bucket = index >> 8;
            uint256 mask = 1 << (index & 0xff);
            _workersByEpoch[epoch][bucket] |= mask;
        }

        // calculate reward
        uint goldenParticleCountByEpoch = _goldenParticleCountByEpoch[epoch];
        uint totalReward = pricePerWorkerEpoch() / (2 ** (goldenParticleCountByEpoch + 1));

        // save reward and particleResult
        _particleResults[particleHash] = ParticleResult({
            isValid: true,
            epoch: epoch,
            worketsCount: computeUnitIds.length,
            reward: totalReward
        });
        _goldenParticleCountByEpoch[epoch] = ++goldenParticleCountByEpoch;

        // lock reward
        _totalBalance -= totalReward;
        _lockedBalance += totalReward;

        emit ParticleCommitted(particleHash, epoch, computeUnitIds.length, totalReward);
    }

    function withdrawReward(bytes32 computeUnitIds, bytes32[] calldata particlesHashes) external {
        uint index = _getComputeUnit(computeUnitIds).index;

        // calculate total reward
        uint totalReward;
        for (uint i = 0; i < particlesHashes.length; i++) {
            bytes32 particleHash = particlesHashes[i];
            BitMaps.BitMap storage paidWorkers = _paidWorkersByParticle[particleHash];

            require(!paidWorkers.get(index), "Already paid");

            uint256 reward = getRewardAmount(particleHash, computeUnitIds);
            totalReward += reward;

            paidWorkers.set(index);

            emit RewardWithdrawn(computeUnitIds, particleHash, reward);
        }

        _lockedBalance -= totalReward;
        paymentToken().safeTransfer(_getComputeUnit(computeUnitIds).owner, totalReward);
    }
}
