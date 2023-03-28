// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";
import "./DealConfigInternal.sol";
import "./WorkersManagerInternal.sol";
import "./Types.sol";
import "../../Utils/Consts.sol";

abstract contract PaymentInternal is DealConfigInternal, WorkersManagerInternal {
    using BitMaps for BitMaps.BitMap;
    using SafeERC20 for IERC20;

    struct ParticleInfo {
        bool isValid;
        uint256 epoch;
        uint256 worketsCount;
        uint reward;
    }

    mapping(uint => uint) private _goldenParticlesCountByEpoch;
    mapping(bytes32 => ParticleInfo) private _particles;
    mapping(uint => mapping(uint => uint)) private _workersByEpoch;
    mapping(bytes32 => BitMaps.BitMap) private _paidWorkersByParticle;

    uint256 private _balance;
    uint256 private _locked;

    function _getPaymentBalance() internal view returns (uint256) {
        return _balance;
    }

    function _getReward(bytes32 particleHash, PATId patId) internal view returns (uint) {
        ParticleInfo storage particle = _particles[particleHash];
        require(particle.isValid, "Particle not valid");

        uint currentEpoch = _core().epochManager().currentEpoch();
        uint epoch = particle.epoch;

        require(currentEpoch - 1 > epoch, "Particle not confirmed");

        if (!_hasWorkerInEpoch(epoch, patId) || !_hasWorkerInEpoch(epoch - 1, patId)) {
            return 0;
        }

        return particle.reward / particle.worketsCount;
    }

    function _depositToPaymentBalance(uint256 amount) internal {
        IERC20 token = _paymentToken();
        token.safeTransferFrom(msg.sender, address(this), amount);
        _balance += amount;
    }

    function _withdrawFromPaymentBalance(uint256 amount) internal {
        IERC20 token = _paymentToken();
        require(_balance - _locked >= amount, "Not enough free balance");

        _balance -= amount;
        token.safeTransfer(msg.sender, amount);
    }

    function _commitParticle(Particle calldata particle) internal {
        bytes32 hash = keccak256(abi.encode(particle.air, particle.prevData, particle.params, particle.callResults)); // TODO: refactoring

        require(_particles[hash].epoch == 0, "Particle already exists");

        uint epoch = _core().epochManager().currentEpoch();

        PATId[] memory patIds = _particleVerifyer().verifyParticle(particle);

        for (uint i = 0; i < patIds.length; i++) {
            uint index = _getPATIndex(patIds[i]);
            uint256 bucket = index >> 8;
            uint256 mask = 1 << (index & 0xff);
            _workersByEpoch[epoch][bucket] |= mask; // TODO: gass optimization
        }

        uint goldenParticlesCountByEpoch = _goldenParticlesCountByEpoch[epoch];
        uint price = _pricePerEpoch();

        uint reward = price / (2 ** (goldenParticlesCountByEpoch + 1));

        _particles[hash] = ParticleInfo({ isValid: true, epoch: epoch, worketsCount: patIds.length, reward: reward });
        _goldenParticlesCountByEpoch[epoch] = goldenParticlesCountByEpoch + 1;
        _balance -= reward;
        _locked += reward;
    }

    function _withdrawForWorker(PATId patId, bytes32[] calldata particlesHashes) internal {
        uint index = _getPATIndex(patId);

        uint totalReward;
        for (uint i = 0; i < particlesHashes.length; i++) {
            bytes32 particleHash = particlesHashes[i];

            require(!_paidWorkersByParticle[particleHash].get(index), "Already paid");

            totalReward += _getReward(particleHash, patId);

            _paidWorkersByParticle[particleHash].set(index);
        }

        _locked -= totalReward;
        _paymentToken().safeTransfer(_getPATOwner(patId), totalReward);
    }

    function _hasWorkerInEpoch(uint epoch, PATId id) private view returns (bool) {
        uint index = _getPATIndex(id);
        uint256 bucket = index >> 8;
        uint256 mask = 1 << (index & 0xff);
        if (_workersByEpoch[epoch][bucket] & mask == 0) {
            return false;
        }

        return true;
    }
}
