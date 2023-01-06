pragma solidity ^0.8.17;

abstract contract RMInternalInterface {
    enum Role {
        None,
        ResourceManager
    }

    struct RoleState {
        mapping(address => Role) roles;
    }

    modifier onlyResourceManager() virtual;

    function _register(address participantAddr, Role role) internal virtual;

    function _setRole(address addr, Role role) internal virtual;

    function _getRole(address addr) internal view virtual returns (Role);
}
