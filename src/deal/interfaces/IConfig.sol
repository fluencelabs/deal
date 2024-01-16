// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "src/deal/base/Types.sol";

interface IConfig {
    // ------------------ Types ------------------
    enum AccessType {
        NONE,
        WHITELIST,
        BLACKLIST
    }

    // ------------------ Events ------------------
    event AppCIDChanged(CIDV1 newAppCID);
    event ProvidersAccessTypeChanged(AccessType newAccessType);
    event ProviderAddedToAccessList(address provider);
    event ProviderRemovedFromAccessList(address provider);

    // ------------------ View Functions ---------------------
    function paymentToken() external view returns (IERC20);
    function creationBlock() external view returns (uint256);
    function pricePerWorkerEpoch() external view returns (uint256);
    function targetWorkers() external view returns (uint256);
    function minWorkers() external view returns (uint256);
    function effectors() external view returns (CIDV1[] memory);
    function appCID() external view returns (CIDV1 memory);
    function maxWorkersPerProvider() external view returns (uint256);
    function providersAccessType() external view returns (AccessType);
    function isProviderAllowed(address account) external view returns (bool);

    // ------------------ Mutable Functions ------------------
    function setAppCID(CIDV1 calldata appCID_) external;
    function changeProvidersAccessType(AccessType accessType) external;
    function addProviderToAccessList(address provider) external;
    function removeProviderFromAccessList(address provider) external;
}
