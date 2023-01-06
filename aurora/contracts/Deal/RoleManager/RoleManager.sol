pragma solidity ^0.8.17;

import "./RoleManagerInternal.sol";

contract RoleManager is RoleManagerInternal {
    function register() external {
        _register(msg.sender, Role.ResourceManager);
    }

    function getRole(address addr) external view returns (Role) {
        return _getRole(addr);
    }
}
