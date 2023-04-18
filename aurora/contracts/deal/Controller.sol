// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./interfaces/IController.sol";
import "./base/ModuleBase.sol";

contract Controller is ModuleBase, OwnableUpgradeable, IController {
    function initialize() public initializer {
        __Ownable_init();
    }

    function owner() public view override(IController, OwnableUpgradeable) returns (address) {
        return OwnableUpgradeable.owner();
    }

    function setAppCID(string calldata cid) external onlyOwner {
        _core().getConfig().setAppCID(cid);
    }

    function join() external {
        _core().getWorkers().createPAT(msg.sender);
    }

    function joinViaMatcher(address resourceOwner) external {
        _core().getWorkers().createPAT(resourceOwner);
    }

    function transferOwnership(address newOwner) public override(IController, OwnableUpgradeable) onlyOwner {
        OwnableUpgradeable.transferOwnership(newOwner);
    }
}
