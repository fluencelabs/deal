// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "src/utils/OwnableUpgradableDiamond.sol";
import "src/deal/Deal.sol";
import "src/core/modules/capacity/interfaces/ICapacity.sol";
import "src/core/modules/market/interfaces/IMarket.sol";

import "./GlobalConst.sol";
import "./interfaces/ICore.sol";

contract Core is UUPSUpgradeable, GlobalConst, ICore {
    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.core.storage.v1")) - 1);

    struct CoreStorage {
        ICapacity capacity;
        IMarket market;
        IDeal dealImpl;
    }

    GlobalConstStorage private _storage;

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
        uint256 minDepositedEpoches_,
        uint256 minRematchingEpoches_,
        IDeal dealImpl_
    ) public initializer {
        __Ownable_init(msg.sender);
        __EpochController_init(epochDuration_);
        __GlobalConst_init(minDepositedEpoches_, minRematchingEpoches_);
        __UUPSUpgradeable_init();

        _getCoreStorage().dealImpl = dealImpl_;
        emit DealImplSet(dealImpl_);
    }

    function initializeModules(ICapacity capacity_, IMarket market_) external onlyOwner {
        CoreStorage storage coreStorage = _getCoreStorage();

        require(address(coreStorage.capacity) == address(0), "Core: capacity and market already initialized");
        require(address(capacity_) != address(0), "Core: capacity is zero address");
        require(address(market_) != address(0), "Core: market is zero address");

        coreStorage.capacity = capacity_;
        coreStorage.market = market_;
    }

    // ------------------ External View Functions ------------------
    function capacity() external view returns (ICapacity) {
        return _getCoreStorage().capacity;
    }

    function market() external view returns (IMarket) {
        return _getCoreStorage().market;
    }

    function dealImpl() external view returns (IDeal) {
        return _getCoreStorage().dealImpl;
    }

    function setDealImpl(IDeal dealImpl_) external onlyOwner {
        require(Address.isContract(address(dealImpl_)), "New deal implementation is not a contract");

        _getCoreStorage().dealImpl = dealImpl_;

        emit DealImplSet(dealImpl_);
    }

    // ------------------ Internal Mutable Functions ------------------

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
