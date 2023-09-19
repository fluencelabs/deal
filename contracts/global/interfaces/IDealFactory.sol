// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "../../deal/base/Types.sol";
import "../../deal/interfaces/IDeal.sol";

interface IDealFactory {
    function isDeal(address addr) external view returns (bool);

    function createDeal(
        uint256 minWorkers_,
        uint256 targetWorkers_,
        CIDV1 calldata appCID_,
        CIDV1[] calldata effectors,
        IDeal.AccessType accessType_,
        address[] calldata accessList_
    ) external returns (address);
}
