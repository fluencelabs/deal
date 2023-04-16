// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import { Particle, PATId } from "../../deal/base/Types.sol";

interface IParticleVerifyer {
    function verifyParticle(Particle calldata particle) external returns (PATId[] memory);
}
