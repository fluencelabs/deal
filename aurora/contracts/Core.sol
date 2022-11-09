pragma solidity ^0.8.17;

import "./auroraSDK/AuroraSdk.sol";
import "./AquaProxy.sol";

contract Core {
    AquaProxy public immutable aquaProxy;
    IERC20 public immutable fluenceToken;

    constructor(AquaProxy aquaProxy_, IERC20 fluenceToken_) {
        aquaProxy = aquaProxy_;
        fluenceToken = fluenceToken_;
    }
}
