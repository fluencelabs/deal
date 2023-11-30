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

    // ------------------ View Functions ---------------------
    function paymentToken() external view returns (IERC20);

    function creationBlock() external view returns (uint256);

    function pricePerWorkerEpoch() external view returns (uint256);

    function targetWorkers() external view returns (uint256);

    function minWorkers() external view returns (uint256);

    function effectors() external view returns (CIDV1[] memory);

    function accessType() external view returns (AccessType);

    function isInAccessList(address addr) external view returns (bool);

    function getAccessList() external view returns (address[] memory);

    function appCID() external view returns (CIDV1 memory);

    function maxWorkersPerProvider() external view returns (uint256);

    // ------------------ Mutable Functions ------------------
    function setAppCID(CIDV1 calldata appCID_) external;

    function changeAccessType(AccessType accessType_) external;

    function removeFromAccessList(address addr) external;
}
