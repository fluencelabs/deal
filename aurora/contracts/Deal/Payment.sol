// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";
import "./DealCore.sol";
import "./Workers.sol";
import "./Types.sol";

contract Payment {
    using BitMaps for BitMaps.BitMap;
    using SafeERC20 for IERC20;

    struct ParticleInfo {
        bool isValid;
        uint256 epoch;
        uint256 worketsCount;
        uint reward;
    }

    uint256 public balance;

    mapping(uint => uint) private _goldenParticlesCountByEpoch;
    mapping(bytes32 => ParticleInfo) private _particles;
    mapping(uint => mapping(uint => uint)) private _workersByEpoch;
    mapping(bytes32 => BitMaps.BitMap) private _paidWorkersByParticle;

    uint256 private _locked;

    function getReward(bytes32 particleHash, PATId patId) public view returns (uint) {
        ParticleInfo storage particle = _particles[particleHash];
        require(particle.isValid, "Particle not valid");

        uint currentEpoch = DealCore(msg.sender).globalConfig().epochManager().currentEpoch();
        uint epoch = particle.epoch;

        require(currentEpoch - 1 > epoch, "Particle not confirmed");

        if (!_hasWorkerInEpoch(epoch, patId) || !_hasWorkerInEpoch(epoch - 1, patId)) {
            return 0;
        }

        return particle.reward / particle.worketsCount;
    }

    function depositToPaymentBalance(uint256 amount) external {
        DealCore core = DealCore(msg.sender);

        IERC20 token = core.paymentToken();
        token.safeTransferFrom(msg.sender, address(this), amount);
        balance += amount;
    }

    function withdrawFromPaymentBalance(uint256 amount) external {
        DealCore core = DealCore(msg.sender);

        IERC20 token = core.paymentToken();
        require(balance - _locked >= amount, "Not enough free balance");

        balance -= amount;
        token.safeTransfer(msg.sender, amount);
    }

    function commitParticle(Particle calldata particle) external {
        bytes32 hash = keccak256(abi.encode(particle.air, particle.prevData, particle.params, particle.callResults)); // TODO: refactoring

        require(_particles[hash].epoch == 0, "Particle already exists");

        DealCore core = DealCore(msg.sender);
        Workers workers = Workers(core.modules(Module.Workers));

        uint epoch = core.globalConfig().epochManager().currentEpoch();

        PATId[] memory patIds = core.particleVerifyer().verifyParticle(particle);

        for (uint i = 0; i < patIds.length; i++) {
            uint index = workers.getPATIndex(patIds[i]);
            uint256 bucket = index >> 8;
            uint256 mask = 1 << (index & 0xff);
            _workersByEpoch[epoch][bucket] |= mask; // TODO: gass optimization
        }

        uint goldenParticlesCountByEpoch = _goldenParticlesCountByEpoch[epoch];
        uint price = core.pricePerEpoch();

        uint reward = price / (2 ** (goldenParticlesCountByEpoch + 1));

        _particles[hash] = ParticleInfo({ isValid: true, epoch: epoch, worketsCount: patIds.length, reward: reward });
        _goldenParticlesCountByEpoch[epoch] = goldenParticlesCountByEpoch + 1;

        balance -= reward;
        _locked += reward;
    }

    function withdrawForWorker(PATId patId, bytes32[] calldata particlesHashes) external {
        DealCore core = DealCore(msg.sender);
        Workers workers = Workers(core.modules(Module.Workers));

        uint index = workers.getPATIndex(patId);

        uint totalReward;
        for (uint i = 0; i < particlesHashes.length; i++) {
            bytes32 particleHash = particlesHashes[i];

            require(!_paidWorkersByParticle[particleHash].get(index), "Already paid");

            totalReward += getReward(particleHash, patId);

            _paidWorkersByParticle[particleHash].set(index);
        }

        _locked -= totalReward;
        core.paymentToken().safeTransfer(workers.getPATOwner(patId), totalReward);
    }

    function _hasWorkerInEpoch(uint epoch, PATId id) private view returns (bool) {
        DealCore core = DealCore(msg.sender);
        Workers workers = Workers(core.modules(Module.Workers));

        uint index = workers.getPATIndex(id);
        uint256 bucket = index >> 8;
        uint256 mask = 1 << (index & 0xff);
        if (_workersByEpoch[epoch][bucket] & mask == 0) {
            return false;
        }

        return true;
    }
}
