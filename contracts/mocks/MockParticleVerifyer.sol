// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "../global/interfaces/IParticleVerifyer.sol";
import { Particle } from "../deal/base/Types.sol";

contract MockParticleVerifyer is IParticleVerifyer {
    mapping(bytes32 => bytes32[]) public particlePATIds;

    function verifyParticle(Particle calldata particle) external returns (bytes32[] memory) {
        bytes32 hash = keccak256(abi.encodePacked(particle.air, particle.prevData, particle.params, particle.callResults));

        return particlePATIds[hash];
    }

    function setPATIds(Particle calldata particle, bytes32[] memory patIds) external {
        bytes32 hash = keccak256(abi.encodePacked(particle.air, particle.prevData, particle.params, particle.callResults));

        particlePATIds[hash] = patIds;
    }
}
