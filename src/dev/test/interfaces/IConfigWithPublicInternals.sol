// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "src/core/interfaces/ICore.sol";
import "src/deal/interfaces/IConfig.sol";

interface IConfigWithPublicInternals is IConfig {
    function Config_init(
        ICore globalCore_,
        CIDV1 calldata appCID_,
        IERC20 paymentToken_,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 pricePerWorkerEpoch_,
        CIDV1[] calldata effectors_,
        address owner_,
        AccessType providersAccessType_,
        address[] calldata providersAccessList_
    ) external;

    function globalCore() external view returns (ICore);
}
