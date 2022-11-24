pragma solidity ^0.8.17;

import "./AuroraSDK/AuroraSdk.sol";
import "./AquaProxy.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Core is Ownable {
    uint constant SLASH_FACTOR = 100;

    uint public constant WITHDRAW_TIMEOUT = 1 minutes;

    AquaProxy public immutable aquaProxy;
    IERC20 public immutable fluenceToken;

    constructor(AquaProxy aquaProxy_, IERC20 fluenceToken_) {
        aquaProxy = aquaProxy_;
        fluenceToken = fluenceToken_;
    }

    function upgradeTo() public {}
}
