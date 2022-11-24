pragma solidity ^0.8.17;

import "./AuroraSDK/AuroraSdk.sol";
import "./AquaProxy.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

library Constants {
    string constant PREFIX = "network.fluence.";

    function create_state(string memory key) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(PREFIX, key));
    }

    function calculate_slot(string memory key) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(PREFIX, key));
    }
}