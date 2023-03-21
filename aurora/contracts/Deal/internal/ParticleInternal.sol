pragma solidity ^0.8.17;

import "./interfaces/IParticleInternal.sol";
import "./interfaces/IDealConfigInternal.sol";
import "../external/interfaces/IWorkersManager.sol";
import "./interfaces/IWorkersManagerInternal.sol";
import { PATId, PAT, Particle } from "./Types.sol";

uint constant WORKER_CONFIRMATIONS = 3; //TODO: move to config

abstract contract ParticleInternal is IParticleInternal, IParticleMutableInternal, IDealConfigInternal, IWorkersManagerInternal {
    struct ParticleInfo {
        bool isValid;
        uint256 epoch;
        uint256 worketsCount;
    }

    mapping(uint => bool) private _isExistsGoldenParticlesInEpoch;

    mapping(bytes32 => ParticleInfo) private _particles;

    mapping(uint => uint256[]) private _workersByEpoch;

    mapping(uint => uint256[]) private _slashedByEpoch;

    function _sendParticle(Particle calldata particle) internal override {
        bytes32 hash = keccak256(abi.encode(particle.air, particle.prevData, particle.params, particle.callResults)); // TODO: refactoring

        require(_particles[hash].epoch == 0, "Particle already exists");

        uint epoch = _core().epochManager().currentEpoch();

        // verify is golden particle in near
        // return error type
        // return if is invalid

        PATId[] memory patIds;

        uint lastIndex = _getNextWorkerIndex();
        uint256[] memory workInfo = new uint256[](lastIndex >> 8);

        for (uint i = 0; i < patIds.length; i++) {
            PAT storage pat = _getPAT(patIds[i]);
            uint index = pat.index;
            uint256 bucket = index >> 8;
            uint256 mask = 1 << (index & 0xff);
            workInfo[bucket] |= mask;
        }

        _isExistsGoldenParticlesInEpoch[epoch] = true;
        _workersByEpoch[epoch] = workInfo;
        _particles[hash] = ParticleInfo({ isValid: true, epoch: epoch, worketsCount: patIds.length });
    }

    function _hasReward(bytes32 particleHash, bytes32 patId) internal view override returns (bool) {
        ParticleInfo storage particle = _particles[particleHash];
        require(particle.isValid, "Particle not valid");

        PAT storage pat = _getPAT(PATId.wrap(patId));
        uint epoch = particle.epoch;

        uint confirmedEpoch = epoch + WORKER_CONFIRMATIONS;
        for (uint i = epoch; i < confirmedEpoch; i++) {
            uint index = pat.index;
            uint256 bucket = index >> 8;
            uint256 mask = 1 << (index & 0xff);
            if (_workersByEpoch[epoch][bucket] & mask == 0) {
                return false;
            }
        }

        return true;
    }

    function _existsGoldenParticlesInEpoch(uint256 epoch) internal view override returns (bool) {
        return _isExistsGoldenParticlesInEpoch[epoch];
    }
}
