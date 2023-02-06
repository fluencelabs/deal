pragma solidity ^0.8.17;

import "./external/DealConfig.sol";
import "./external/PaymentManager.sol";
import "./external/ProviderManager.sol";
import "./external/WithdrawManager.sol";

import "./internal/DealConfigInternal.sol";
import "./internal/ProviderManagerInternal.sol";
import "./internal/WithdrawManagerInternal.sol";

contract Deal is
    DealConfig,
    PaymentManager,
    ProviderManager,
    WithdrawManager,
    DealConfigInternal,
    ProviderManagerInternal,
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
        bytes32 appCID_,
        bytes32[] memory effectorWasmsCids_
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
