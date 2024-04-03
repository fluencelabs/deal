// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "src/deal/Config.sol";

contract ConfigWithPublicInternals is Initializable, Config {
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
    ) public initializer {
        __Config_init(
            globalCore_,
            appCID_,
            paymentToken_,
            minWorkers_,
            targetWorkers_,
            maxWorkersPerProvider_,
            pricePerWorkerEpoch_,
            effectors_,
            owner_,
            providersAccessType_,
            providersAccessList_
        );
    }

    function globalCore() public view returns (ICore) {
        return _globalCore();
    }
}
