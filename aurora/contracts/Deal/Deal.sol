pragma solidity ^0.8.17;

import "./DealConfig.sol";
import "./ProviderManager.sol";
import "../Core/Core.sol";

contract Deal is ProviderManager {
    constructor(
        Core core_,
        bytes32 subnetId_,
        Settings memory settings_
    ) DealConfig(core_, subnetId_, settings_) {}
}
