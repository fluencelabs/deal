pragma solidity ^0.8.17;

import "../../Core/Core.sol";

interface IProviderManager {
    type PATId is bytes32;

    event AddProviderToken(address indexed owner, PATId id);

    struct PAT {
        address owner;
        uint256 collateral;
    }

    function addProviderToken(bytes32 salt) external;

    function removeProviderToken(PATId id) external;

    function slash(
        PATId id,
        address addr,
        AquaProxy.Particle calldata particle
    ) external;
}
