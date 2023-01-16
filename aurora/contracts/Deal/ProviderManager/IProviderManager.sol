pragma solidity ^0.8.17;

import "../../Core/Core.sol";

interface IProviderManager {
    type PATId is bytes32;

    event AddProviderToken(address indexed owner, PATId id);
    event RemoveProviderToken(PATId id);

    function createProviderToken(bytes32 salt) external;

    function removeProviderToken(PATId id) external;

    function slash(PATId id, AquaProxy.Particle calldata particle) external;

    function getPATOwner(PATId id) external view returns (address);
}
