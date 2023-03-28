// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "../ParticleVerifyer/IParticleVerifyer.sol";
import { Particle, PATId } from "../Deal/internal/Types.sol";

contract MockParticleVerifyer is IParticleVerifyer {
    mapping(bytes32 => PATId[]) public particlePATIds;

    function verifyParticle(Particle calldata particle) external returns (PATId[] memory) {
        bytes32 hash = keccak256(abi.encodePacked(particle.air, particle.prevData, particle.params, particle.callResults));

        return particlePATIds[hash];
    }

    function setPATIds(Particle calldata particle, PATId[] memory patIds) external {
        bytes32 hash = keccak256(abi.encodePacked(particle.air, particle.prevData, particle.params, particle.callResults));

        particlePATIds[hash] = patIds;
    }
}
