pragma solidity ^0.8.17;

import "../../../Core/Core.sol";

interface IWorkersManager {
    type PATId is bytes32;

    event AddProviderToken(address indexed owner, PATId id);
    event RemoveProviderToken(PATId id);

    function getPATOwner(PATId id) external view returns (address);

    function createProviderToken(bytes32 salt) external;

    function removeProviderToken(PATId id) external;
}
