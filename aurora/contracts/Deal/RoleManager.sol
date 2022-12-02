pragma solidity ^0.8.17;

import "./DealConfig.sol";
import "../Utils/WithdrawRequests.sol";
import "../Core/Core.sol";

contract RoleManagerState {
    enum Role {
        None,
        ResourceManager
    }
    mapping(address => Role) roles;
}

contract RoleManager is RoleManagerState {
    modifier onlyResourceManager() {
        require(roles[msg.sender] == Role.ResourceManager, "Only peer owner");
        _;
    }

    function register() external {
        _register(msg.sender, Role.ResourceManager);
    }

    function _register(address participantAddr, Role role) private {
        require(
            roles[participantAddr] == Role.None,
            "Participant already exist"
        );
        roles[participantAddr] = role;
    }

    function _setRole(address addr, Role role) internal {
        require(roles[addr] == Role.None, "Participant already exist");
        roles[addr] = role;
    }
}
