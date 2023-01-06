pragma solidity ^0.8.17;

import "./DealConfig/DealConfig.sol";
import "./DepositManager/DepositManager.sol";
import "./ProviderManager/ProviderManager.sol";
import "./RoleManager/RoleManager.sol";
import "../Core/Core.sol";

contract Deal is DealConfig, DepositManager, ProviderManager, RoleManager {
    constructor(
        Core core_,
        bytes32 subnetId_,
        Settings memory settings_
    ) DealConfig(core_, subnetId_, settings_) {}
}
