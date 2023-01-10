pragma solidity ^0.8.17;

import "./DealConfig/DealConfig.sol";
import "./BalanceManager/BalanceManagerInternal.sol";
import "./ProviderManager/ProviderManager.sol";
import "./RoleManager/RoleManager.sol";
import "../Core/Core.sol";
import "./PaymentManager/PaymentManager.sol";

contract Deal is
    ProviderManager,
    PaymentManager,
    RoleManager,
    DealConfig,
    BalanceManagerInternal
{
    constructor(
        Core core_,
        bytes32 subnetId_,
        Settings memory settings_
    ) DealConfig(core_, subnetId_, settings_) {}
}
