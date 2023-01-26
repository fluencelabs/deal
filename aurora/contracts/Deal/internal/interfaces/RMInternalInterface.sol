pragma solidity ^0.8.17;

abstract contract RMInternalInterface {
    enum Role {
        None,
        ResourceManager
    }

    modifier onlyResourceManager() virtual;

    modifier onlyDealOwner() virtual;

    function _setRole(address addr, Role role) internal virtual;

    function _getRole(address addr) internal view virtual returns (Role);
}
