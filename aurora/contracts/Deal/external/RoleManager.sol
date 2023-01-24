pragma solidity ^0.8.17;

import "../internal/interfaces/RMInternalInterface.sol";

abstract contract RoleManager is RMInternalInterface {
    function register() external {
        _register(msg.sender, Role.ResourceManager);
    }

    function getRole(address addr) external view returns (Role) {
        return _getRole(addr);
    }
}
