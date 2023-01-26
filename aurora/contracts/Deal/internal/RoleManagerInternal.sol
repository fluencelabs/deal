pragma solidity ^0.8.17;

import "./interfaces/RMInternalInterface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RoleManagerInternal is Ownable, RMInternalInterface {
    mapping(address => Role) private _roles;

    modifier onlyResourceManager() override {
        require(
            _getRole(msg.sender) == Role.ResourceManager,
            "Only peer owner"
        );
        _;
    }

    modifier onlyDealOwner() override {
        require(msg.sender == owner(), "Only deal owner");
        _;
    }

    function _setRole(address addr, Role role) internal override {
        require(_roles[addr] == Role.None, "Participant already exist");
        _roles[addr] = role;
    }

    function _getRole(address addr) internal view override returns (Role) {
        return _roles[addr];
    }
}
