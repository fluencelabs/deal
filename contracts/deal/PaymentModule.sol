// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";
import "./interfaces/IPaymentModule.sol";
import "./interfaces/ICore.sol";
import "./interfaces/IWorkersModule.sol";
import "./base/Types.sol";
import "./base/ModuleBase.sol";

contract PaymentModuleState {
    struct ParticleInfo {
        bool isValid;
        uint256 epoch;
        uint256 worketsCount;
        uint reward;
    }

    uint256 internal _balance;
    uint256 internal _locked;

    mapping(uint => uint) internal _goldenParticlesCountByEpoch;
    mapping(bytes32 => ParticleInfo) internal _particles;
    mapping(uint => mapping(uint => uint)) internal _workersByEpoch;
    mapping(bytes32 => BitMaps.BitMap) internal _paidWorkersByParticle;
}

contract PaymentModuleInternal is ModuleBase, PaymentModuleState {
    function _hasWorkerInEpoch(uint epoch, PATId id) internal view returns (bool) {
        IWorkersModule workers = _core().workersModule();

        uint index = 0; //TODO: fix
        uint256 bucket = index >> 8;
        uint256 mask = 1 << (index & 0xff);
        if (_workersByEpoch[epoch][bucket] & mask == 0) {
            return false;
        }

        return true;
    }
}

abstract contract PaymentModuleOwnable is PaymentModuleInternal, IPaymentModule {
    using BitMaps for BitMaps.BitMap;
    using SafeERC20 for IERC20;

    function depositToPaymentBalance(uint256 amount) external onlyOwner {
        IERC20 token = _core().configModule().paymentToken();
        token.safeTransferFrom(msg.sender, address(this), amount);
        _balance += amount;

        //TODO: event
    }

    function withdrawFromPaymentBalance(uint256 amount) external onlyOwner {
        IERC20 token = _core().configModule().paymentToken();
        require(_balance - _locked >= amount, "Not enough free balance");

        _balance -= amount;
        token.safeTransfer(msg.sender, amount);

        //TODO: event
    }
}

contract PaymentModule is PaymentModuleOwnable {
    using BitMaps for BitMaps.BitMap;
    using SafeERC20 for IERC20;

    function rewardAmount(bytes32 particleHash, PATId patId) public view returns (uint) {
        ParticleInfo storage particle = _particles[particleHash];
        require(particle.isValid, "Particle not valid");

        uint currentEpoch = _core().configModule().globalConfig().epochManager().currentEpoch();
        uint epoch = particle.epoch;

        require(currentEpoch - 1 > epoch, "Particle not confirmed");

        if (!_hasWorkerInEpoch(epoch, patId) || !_hasWorkerInEpoch(epoch - 1, patId)) {
            return 0;
        }

        return particle.reward / particle.worketsCount;
    }

    function balance() external view returns (uint256) {
        return _balance;
    }

    function commitParticle(Particle calldata particle) external {
        bytes32 hash = keccak256(abi.encode(particle.air, particle.prevData, particle.params, particle.callResults)); // TODO: refactoring

        require(_particles[hash].epoch == 0, "Particle already exists");

        ICore core = _core();
        IConfigModule config = core.configModule();
        IWorkersModule workers = core.workersModule();

        uint epoch = config.globalConfig().epochManager().currentEpoch();

        PATId[] memory patIds = config.particleVerifyer().verifyParticle(particle);

        for (uint i = 0; i < patIds.length; i++) {
            uint index = 0; // TODO: fix
            uint256 bucket = index >> 8;
            uint256 mask = 1 << (index & 0xff);
            _workersByEpoch[epoch][bucket] |= mask; // TODO: gass optimization
        }

        uint goldenParticlesCountByEpoch = _goldenParticlesCountByEpoch[epoch];
        uint price = config.pricePerEpoch();

        uint reward = price / (2 ** (goldenParticlesCountByEpoch + 1));

        _particles[hash] = ParticleInfo({ isValid: true, epoch: epoch, worketsCount: patIds.length, reward: reward });
        _goldenParticlesCountByEpoch[epoch] = goldenParticlesCountByEpoch + 1;

        _balance -= reward;
        _locked += reward;

        //TODO: event
    }

    function withdrawReward(PATId patId, bytes32[] calldata particlesHashes) external {
        ICore core = _core();
        IConfigModule config = core.configModule();

        IWorkersModule workers = core.workersModule();

        uint index = 0; //todo: workers.getPATIndex(patId);

        uint totalReward;
        for (uint i = 0; i < particlesHashes.length; i++) {
            bytes32 particleHash = particlesHashes[i];

            require(!_paidWorkersByParticle[particleHash].get(index), "Already paid");

            totalReward += rewardAmount(particleHash, patId);

            _paidWorkersByParticle[particleHash].set(index);
        }

        _locked -= totalReward;
        config.paymentToken().safeTransfer(workers.getPAT(patId).owner, totalReward);

        //TODO: event
    }
}
