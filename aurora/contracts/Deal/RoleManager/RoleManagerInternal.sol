pragma solidity ^0.8.17;

import "./RMInternalInterface.sol";

contract RoleManagerInternal is RMInternalInterface {
    RoleState private _roleManagerState;

    modifier onlyResourceManager() override {
        require(
            _getRole(msg.sender) == Role.ResourceManager,
            "Only peer owner"
        );
        _;
    }

    function _register(address participantAddr, Role role) internal override {
        require(
            _roleManagerState.roles[participantAddr] == Role.None,
            "Participant already exist"
        );
        _roleManagerState.roles[participantAddr] = role;
    }

    function _setRole(address addr, Role role) internal override {
        require(
            _roleManagerState.roles[addr] == Role.None,
            "Participant already exist"
        );
        _roleManagerState.roles[addr] = role;
    }

    function _getRole(address addr) internal view override returns (Role) {
        return _roleManagerState.roles[addr];
    }
}
