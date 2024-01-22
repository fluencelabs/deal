// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

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
    constructor(IERC20 fluenceToken_) GlobalConst(fluenceToken_) {
        _disableInitializers();
    }

    // ------------------ Initializer ------------------
    function initialize(uint256 epochDuration_, uint256 minDepositedEpoches_, uint256 minRematchingEpoches_)
        public
        initializer
    {
        __Ownable_init(msg.sender);
        __EpochController_init(epochDuration_);
        __GlobalConst_init(minDepositedEpoches_, minRematchingEpoches_);
    }

    function initializeModules(ICapacity capacity_, IMarket market_) external onlyOwner {
        CoreStorage storage coreStorage = _getCoreStorage();

        require(address(coreStorage.capacity) == address(0), "Core:capacity already initialized");
        require(address(coreStorage.market) == address(0), "Core: market already initialized");
        require(address(capacity_) != address(0), "Core: capacity is zero address");
        require(address(market_) != address(0), "Core: market is zero address");

        coreStorage.capacity = capacity_;
        coreStorage.market = market_;
    }

    // ------------------ External View Functions ------------------
    function capacity() external view override returns (ICapacity) {
        return _getCoreStorage().capacity;
    }

    function market() external view override returns (IMarket) {
        return _getCoreStorage().market;
    }

    // ------------------ Internal Mutable Functions ------------------
    function _authorizeUpgrade(address) internal override onlyOwner {}
}
