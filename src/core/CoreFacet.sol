// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import {ICore} from "src/core/interfaces/ICore.sol";
import {Whitelist} from "src/utils/Whitelist.sol";
import {LibDiamond} from "src/lib/LibDiamond.sol";
import {LibCore} from "src/lib/LibCore.sol";
import {IDeal} from "src/deal/interfaces/IDeal.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {GlobalConst} from "src/core/GlobalConst.sol";
import {LibCapacityConst} from "src/lib/LibCapacityConst.sol";

contract CoreFacet is ICore, Whitelist, GlobalConst {
    function dealImpl() external view returns (IDeal) {
        return LibCore.dealImpl();
    }

    function setActiveUnitCount(uint256 activeUnitCount_) external {
        return LibCapacityConst.setActiveUnitCount(activeUnitCount_);
    }

    function setDealImpl(IDeal dealImpl_) external {
        LibDiamond.enforceIsContractOwner();
        require(Address.isContract(address(dealImpl_)), "New deal implementation is not a contract");

        LibCore.store().dealImpl = dealImpl_;
        emit DealImplSet(dealImpl_);
    }
}
