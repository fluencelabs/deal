// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {IDeal} from "src/deal/interfaces/IDeal.sol";
import {IGlobalConst} from "src/core/interfaces/IGlobalConst.sol";

/// @title Core contract interface
/// @dev Core contract is the main contract of the system and it is responsible for navigation between modules
interface ICore is IGlobalConst {
    event DealImplSet(IDeal dealImpl);

    function dealImpl() external view returns (IDeal);
    function setActiveUnitCount(uint256 activeUnitCount_) external;
    function setDealImpl(IDeal dealImpl_) external;
}
