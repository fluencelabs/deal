pragma solidity ^0.8.17;

import "../../../Core/Core.sol";
import { PATId } from "../../internal/Types.sol";

interface IWorkersManager {
    event AddProviderToken(address indexed owner, PATId id);
    event RemoveProviderToken(PATId id);

    function getPATOwner(PATId id) external view returns (address);

    function createProviderToken(bytes32 salt, uint index) external;

    function removeProviderToken(PATId id) external;
}
