// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "./external/DealConfig.sol";
import "./external/WithdrawManager.sol";
import "./external/WorkersManager.sol";
import "./external/Payment.sol";

import "./internal/DealConfigInternal.sol";
import "./internal/PaymentInternal.sol";
import "./internal/StatusControllerInternal.sol";
import "./internal/WithdrawManagerInternal.sol";
import "./internal/WorkersManagerInternal.sol";

contract Deal is DealConfig, WithdrawManager, WorkersManager, Payment {
    constructor(
        Core core_,
        address paymentToken_,
        uint256 pricePerEpoch_,
        uint256 requiredStake_,
        uint256 minWorkers_,
        uint256 maxWorkers_,
        uint256 targetWorkers_,
        string memory appCID_,
        string[] memory effectorWasmsCids_,
        IParticleVerifyer particleVerifyer_
    )
        DealConfigInternal(
            core_,
            paymentToken_,
            pricePerEpoch_,
            requiredStake_,
            minWorkers_,
            maxWorkers_,
            targetWorkers_,
            appCID_,
            effectorWasmsCids_,
            particleVerifyer_
        )
    {}
}
