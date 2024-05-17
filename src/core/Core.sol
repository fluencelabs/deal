// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "src/core/modules/capacity/interfaces/ICapacity.sol";
import "src/core/modules/market/interfaces/IMarket.sol";
import "src/core/modules/market/interfaces/IDealFactory.sol";
import "./GlobalConst.sol";
import "./interfaces/ICore.sol";
import "src/utils/Whitelist.sol";

contract Core is ICore, UUPSUpgradeable, GlobalConst, Whitelist {
    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.core.storage.v1")) - 1);

    struct CoreStorage {
        ICapacity capacity;
        IMarket market;
        IDeal dealImpl;
        IDealFactory dealFactory;
    }

    function _getCoreStorage() private pure returns (CoreStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ------------------ Constructor ------------------
    // @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // ------------------ Initializer ------------------
    function initialize(
        uint256 epochDuration_,
        uint256 minDepositedEpochs_,
        uint256 minRematchingEpochs_,
        uint256 minProtocolVersion_,
        uint256 maxProtocolVersion_,
        IDeal dealImpl_,
        bool isWhitelistEnabled_,
        CapacityConstInitArgs memory capacityConstInitArgs_
    ) public initializer {
        __Ownable_init(msg.sender);
        __EpochController_init(epochDuration_);
        __GlobalConst_init(minDepositedEpochs_, minRematchingEpochs_, minProtocolVersion_, maxProtocolVersion_);
        __UUPSUpgradeable_init();
        __Whitelist_init(isWhitelistEnabled_);
        __CapacityConst_init(capacityConstInitArgs_);

        _getCoreStorage().dealImpl = dealImpl_;
        emit DealImplSet(dealImpl_);
    }

    function initializeModules(ICapacity capacity_, IMarket market_, IDealFactory dealFactory_) external onlyOwner {
        CoreStorage storage coreStorage = _getCoreStorage();

        require(address(coreStorage.capacity) == address(0), "Core: modules already initialized");
        require(address(capacity_) != address(0), "Core: capacity is zero address");
        require(address(market_) != address(0), "Core: market is zero address");
        require(address(dealFactory_) != address(0), "Core: deal factory is zero address");

        coreStorage.capacity = capacity_;
        coreStorage.market = market_;
        coreStorage.dealFactory = dealFactory_;
    }

    // ------------------ External View Functions ------------------
    function capacity() external view returns (ICapacity) {
        return _getCoreStorage().capacity;
    }

    function market() external view returns (IMarket) {
        return _getCoreStorage().market;
    }

    function dealFactory() external view returns (IDealFactory) {
        return _getCoreStorage().dealFactory;
    }

    function dealImpl() external view returns (IDeal) {
        return _getCoreStorage().dealImpl;
    }

    function setDealImpl(IDeal dealImpl_) external onlyOwner {
        require(Address.isContract(address(dealImpl_)), "New deal implementation is not a contract");

        _getCoreStorage().dealImpl = dealImpl_;

        emit DealImplSet(dealImpl_);
    }

    function setActiveUnitCount(uint256 activeUnitCount_) external {
        require(msg.sender == address(_getCoreStorage().capacity), "Core: caller is not capacity");
        _setActiveUnitCount(activeUnitCount_);
    }

    // ------------------ Internal Mutable Functions ------------------

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
