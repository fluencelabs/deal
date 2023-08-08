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
    // ----------------- Types -----------------
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

    event RewardWithdrawn(bytes32 patId, bytes32 particleHash, uint256 reward);

    // ----------------- Internal Vars -----------------
    uint256 internal _totalBalance;
    uint256 internal _lockedBalance;

    mapping(uint => uint) internal _goldenParticleCountByEpoch;
    mapping(bytes32 => ParticleResult) internal _particleResults;
    mapping(uint => mapping(uint => uint)) internal _workersByEpoch;
    mapping(bytes32 => BitMaps.BitMap) internal _paidWorkersByParticle;
}

contract PaymentModuleInternal is ModuleBase, PaymentModuleState {
    function _freeBalance() internal view returns (uint256) {
        return _totalBalance - _lockedBalance;
    }

    function _hasWorkerInEpoch(uint epoch, bytes32 patId) internal view returns (bool) {
        IWorkersModule workers = _core().workersModule();

        uint index = workers.getPAT(patId).index;
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
        _totalBalance += amount;

        emit DepositedToPaymentBalance(amount);
    }

    function withdrawFromPaymentBalance(uint256 amount) external onlyOwner {
        IERC20 token = _core().configModule().paymentToken();
        require(_freeBalance() >= amount, "Not enough free balance");

        _totalBalance -= amount;
        token.safeTransfer(msg.sender, amount);

        emit WithdrawnFromPaymentBalance(amount);
    }
}

contract PaymentModule is PaymentModuleOwnable {
    using BitMaps for BitMaps.BitMap;
    using SafeERC20 for IERC20;

    // ----------------- View -----------------
    function getRewardAmount(bytes32 particleHash, bytes32 patId) public view returns (uint) {
        ParticleResult storage particleResults = _particleResults[particleHash];

        require(particleResults.isValid, "Particle not valid");

        // TODO: a lot of calls :(
        uint currentEpoch = _core().configModule().globalConfig().epochManager().currentEpoch();
        uint particleEpoch = particleResults.epoch;

        require(currentEpoch - 1 > particleEpoch, "Particle not confirmed");

        if (!_hasWorkerInEpoch(particleEpoch, patId) || !_hasWorkerInEpoch(particleEpoch - 1, patId)) {
            return 0;
        }

        return particleResults.reward / particleResults.worketsCount;
    }

    function getPaymentBalance() public view returns (uint256) {
        return _totalBalance - _lockedBalance;
    }

    function getLockedBalance() external view returns (uint256) {
        return _lockedBalance;
    }

    // ----------------- Mutable -----------------
    function commitParticle(Particle calldata particle, bytes32[] memory patIds) external {
        // check particle
        bytes32 particleHash = keccak256(abi.encode(particle.air, particle.prevData, particle.params, particle.callResults));
        require(_particleResults[particleHash].epoch == 0, "Particle already exists");

        // load deal modules
        ICore core = _core();
        IConfigModule config = core.configModule();
        IWorkersModule workers = core.workersModule();

        // check patIds
        uint epoch = config.globalConfig().epochManager().currentEpoch();
        for (uint i = 0; i < patIds.length; i++) {
            uint index = workers.getPAT(patIds[i]).index;
            uint256 bucket = index >> 8;
            uint256 mask = 1 << (index & 0xff);
            _workersByEpoch[epoch][bucket] |= mask;
        }

        // calculate reward
        uint goldenParticleCountByEpoch = _goldenParticleCountByEpoch[epoch];
        uint pricePerEpoch = config.pricePerEpoch();
        uint totalReward = pricePerEpoch / (2 ** (goldenParticleCountByEpoch + 1));

        // save reward and particleResult
        _particleResults[particleHash] = ParticleResult({ isValid: true, epoch: epoch, worketsCount: patIds.length, reward: totalReward });
        _goldenParticleCountByEpoch[epoch] = ++goldenParticleCountByEpoch;

        // lock reward
        _totalBalance -= totalReward;
        _lockedBalance += totalReward;

        emit ParticleCommitted(particleHash, epoch, patIds.length, totalReward);
    }

    function withdrawReward(bytes32 patId, bytes32[] calldata particlesHashes) external {
        // load deal modules
        ICore core = _core();
        IConfigModule config = core.configModule();
        IWorkersModule workers = core.workersModule();

        uint index = workers.getPAT(patId).index;

        // calculate total reward
        uint totalReward;
        for (uint i = 0; i < particlesHashes.length; i++) {
            bytes32 particleHash = particlesHashes[i];
            BitMaps.BitMap storage paidWorkers = _paidWorkersByParticle[particleHash];

            require(!paidWorkers.get(index), "Already paid");

            totalReward += getRewardAmount(particleHash, patId);
            paidWorkers.set(index);

            emit RewardWithdrawn(patId, particleHash, totalReward);
        }

        _lockedBalance -= totalReward;
        config.paymentToken().safeTransfer(workers.getPAT(patId).owner, totalReward);
    }
}
