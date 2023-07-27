// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import { Particle } from "../../deal/base/Types.sol";

interface IParticleVerifyer {
    function verifyParticle(Particle calldata particle) external returns (bytes32[] memory);
}
