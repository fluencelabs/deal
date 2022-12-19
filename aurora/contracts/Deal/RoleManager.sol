pragma solidity ^0.8.17;

import "./DealConfig.sol";
import "../Utils/WithdrawRequests.sol";
import "../Core/Core.sol";

contract RoleManagerState {
    enum Role {
        None,
        ResourceManager
    }

    struct RoleState {
        mapping(address => Role) roles;
    }

    RoleState internal _roleManagerState;
}

contract RoleManagerPrivate is RoleManagerState {
    modifier onlyResourceManager() {
        require(
            _roleManagerState.roles[msg.sender] == Role.ResourceManager,
            "Only peer owner"
        );
        _;
    }

    function _register(address participantAddr, Role role) internal {
        require(
            _roleManagerState.roles[participantAddr] == Role.None,
            "Participant already exist"
        );
        _roleManagerState.roles[participantAddr] = role;
    }

    function _setRole(address addr, Role role) internal {
        require(
            _roleManagerState.roles[addr] == Role.None,
            "Participant already exist"
        );
        _roleManagerState.roles[addr] = role;
    }
}

contract RoleManager is RoleManagerPrivate {
    function register() external {
        _register(msg.sender, Role.ResourceManager);
    }

    function getRole(address addr) external view returns (Role) {
        return _roleManagerState.roles[addr];
    }
}
