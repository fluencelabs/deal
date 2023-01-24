pragma solidity ^0.8.17;

import "./external/BalanceManager.sol";
import "./external/DealConfig.sol";
import "./external/PaymentManager.sol";
import "./external/ProviderManager.sol";
import "./external/RoleManager.sol";

import "./internal/BalanceManagerInternal.sol";
import "./internal/DealConfigInternal.sol";
import "./internal/ProviderManagerInternal.sol";
import "./internal/RoleManagerInternal.sol";

contract Deal is
    BalanceManager,
    DealConfig,
    PaymentManager,
    ProviderManager,
    RoleManager,
    BalanceManagerInternal,
    DealConfigInternal,
    ProviderManagerInternal,
    RoleManagerInternal
{
    constructor(
        Core core_,
        bytes32 subnetId_,
        Settings memory settings_
    ) DealConfig(core_, subnetId_, settings_) {}
}
