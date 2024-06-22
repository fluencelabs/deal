// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Address.sol";
import "src/core/modules/capacity/interfaces/ICapacity.sol";
import "src/core/modules/market/interfaces/IMarket.sol";
import "src/core/modules/market/interfaces/IDealFactory.sol";
import {ICore} from "src/core/interfaces/ICore.sol";
import "src/utils/Whitelist.sol";
import {LibDiamond} from "../lib/LibDiamond.sol";
import {LibCore, CoreStorage} from "../lib/LibCore.sol";
import {GlobalConst} from "src/core/GlobalConst.sol";
import {EpochController} from "src/core/EpochController.sol";
import {LibCapacityConst} from "src/lib/LibCapacityConst.sol";

contract CoreFacet is ICore, Whitelist, GlobalConst {
    // ------------------ Initializer ------------------
    // function initialize(
    //     uint256 epochDuration_,
    //     uint256 minDepositedEpochs_,
    //     uint256 minRematchingEpochs_,
    //     uint256 minProtocolVersion_,
    //     uint256 maxProtocolVersion_,
    //     IDeal dealImpl_,
    //     bool isWhitelistEnabled_,
    //     CapacityConstInitArgs memory capacityConstInitArgs_
    // ) external initializer {
    //     __EpochController_init(epochDuration_);
    //     __GlobalConst_init(minDepositedEpochs_, minRematchingEpochs_, minProtocolVersion_, maxProtocolVersion_);
    //     __Whitelist_init(isWhitelistEnabled_);
    //     __CapacityConst_init(capacityConstInitArgs_);

    //     _getCoreStorage().dealImpl = dealImpl_;
    //     emit DealImplSet(dealImpl_);
    // }

    // function initializeModules(ICapacity capacity_, IMarket market_, IDealFactory dealFactory_) external {
    //     LibDiamond.enforceIsContractOwner();
    //     CoreStorage storage coreStorage = LibCore.store();

    //     require(address(coreStorage.capacity) == address(0), "Core: modules already initialized");
    //     require(address(capacity_) != address(0), "Core: capacity is zero address");
    //     require(address(market_) != address(0), "Core: market is zero address");
    //     require(address(dealFactory_) != address(0), "Core: deal factory is zero address");

    //     coreStorage.capacity = capacity_;
    //     coreStorage.market = market_;
    //     coreStorage.dealFactory = dealFactory_;
    // }

    // ------------------ External View Functions ------------------

    function dealImpl() external view returns (IDeal) {
        return LibCore.dealImpl();
    }

    function setActiveUnitCount(uint256 activeUnitCount_) external {
        return LibCapacityConst._setActiveUnitCount(activeUnitCount_);
    }

    function setDealImpl(IDeal dealImpl_) external onlyOwner {
        require(Address.isContract(address(dealImpl_)), "New deal implementation is not a contract");

        LibCore.store().dealImpl = dealImpl_;

        emit DealImplSet(dealImpl_);
    }
}
