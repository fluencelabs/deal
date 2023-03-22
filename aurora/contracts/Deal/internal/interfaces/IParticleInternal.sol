pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../../Core/Core.sol";
import { Particle } from "../Types.sol";

abstract contract IParticleInternal {
    function _hasReward(bytes32 particleHash, bytes32 patId) internal view virtual returns (bool);

    function _existsGoldenParticlesInEpoch(uint256 epoch) internal view virtual returns (bool);
}

abstract contract IParticleMutableInternal {
    function _sendParticle(Particle calldata particle) internal virtual;
}
