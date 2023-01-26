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
        bytes32 subnetId_,
        address paymentToken_,
        uint256 pricePerEpoch_,
        uint256 requiredStake_
    )
        DealConfigInternal(
            core_,
            subnetId_,
            core_.fluenceToken(),
            IERC20(paymentToken_),
            pricePerEpoch_,
            requiredStake_
        )
    {}
}
