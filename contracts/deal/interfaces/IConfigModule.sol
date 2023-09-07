// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../base/Types.sol";
import "../../global/interfaces/IGlobalConfig.sol";

interface IConfigModule {
    enum AccessType {
        NONE,
        WHITELIST,
        BLACKLIST
    }

    event AppCIDChanged(CIDV1 newAppCID);

    function initialize(
        IERC20 paymentToken_,
        uint256 pricePerEpoch_,
        uint256 requiredCollateral_,
        CIDV1 calldata appCID_,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        CIDV1[] calldata effectors_,
        AccessType accessType_,
        address[] calldata accessList_
    ) external;

    // ------------------ VIEWS ---------------------
    function globalConfig() external view returns (IGlobalConfig);

    function paymentToken() external view returns (IERC20);

    function fluenceToken() external view returns (IERC20);

    function creationBlock() external view returns (uint256);

    function pricePerEpoch() external view returns (uint256);

    function targetWorkers() external view returns (uint256);

    function requiredCollateral() external view returns (uint256);

    function minWorkers() external view returns (uint256);

    function effectors() external view returns (CIDV1[] memory);

    function accessType() external view returns (AccessType);

    function isInAccessList(address addr) external view returns (bool);

    function getAccessList() external view returns (address[] memory);

    function appCID() external view returns (CIDV1 memory);

    // ------------------ MUTABLES ------------------
    function setAppCID(CIDV1 calldata appCID_) external;

    function changeAccessType(AccessType accessType_) external;

    function removeFromAccessList(address addr) external;
}
