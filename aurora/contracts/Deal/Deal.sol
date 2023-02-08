pragma solidity ^0.8.17;

import "./external/DealConfig.sol";
import "./external/PaymentManager.sol";
import "./external/ProviderManager.sol";
import "./external/RoleManager.sol";
import "./external/WithdrawManager.sol";

import "./internal/DealConfigInternal.sol";
import "./internal/ProviderManagerInternal.sol";
import "./internal/RoleManagerInternal.sol";
import "./internal/WithdrawManagerInternal.sol";

contract Deal is
    DealConfig,
    PaymentManager,
    ProviderManager,
    RoleManager,
    WithdrawManager,
    DealConfigInternal,
    ProviderManagerInternal,
    RoleManagerInternal,
    WithdrawManagerInternal
{
    constructor(
        Core core_,
        address paymentToken_,
        uint256 pricePerEpoch_,
        uint256 requiredStake_,
        uint256 minWorkers_,
        uint256 maxWorkers_,
        uint256 targetWorkers_,
        string memory appCID_,
        string[] memory effectorWasmsCids_
    )
        DealConfigInternal(
            core_,
            address(core_.fluenceToken()),
            paymentToken_,
            pricePerEpoch_,
            requiredStake_,
            minWorkers_,
            maxWorkers_,
            targetWorkers_,
            appCID_,
            effectorWasmsCids_
        )
    {}
}
