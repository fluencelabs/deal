pragma solidity ^0.8.17;

import "./DealConfig/DealConfig.sol";
import "./BalanceManager/BalanceManagerInternal.sol";
import "./ProviderManager/ProviderManager.sol";
import "./RoleManager/RoleManager.sol";
import "../Core/Core.sol";

contract Deal is
    DealConfig,
    BalanceManagerInternal,
    ProviderManager,
    RoleManager
{
    constructor(
        Core core_,
        bytes32 subnetId_,
        Settings memory settings_
    ) DealConfig(core_, subnetId_, settings_) {}
}
