// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "src/core/interfaces/ICore.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "src/utils/OwnableUpgradableDiamond.sol";

contract BaseModule is Initializable {
    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.module.storage.v1")) - 1);

    struct BaseModuleStorage {
        ICore core;
    }

    BaseModuleStorage private _storage;

    function _getBaseModuleStorage() private pure returns (BaseModuleStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ------------------ Initializer ------------------
    function __BaseModule_init(ICore core) internal onlyInitializing {
        _getBaseModuleStorage().core = core;
    }

    // ------------------ Modifiers ------------------
    modifier onlyCoreOwner() {
        require(OwnableUpgradableDiamond(address(_core())).owner() == msg.sender, "BaseModule: caller is not the owner");
        _;
    }

    modifier onlyMarket() {
        require(address(_core().market()) == msg.sender, "BaseModule: caller is not the market");
        _;
    }

    modifier onlyCapacity() {
        require(address(_core().capacity()) == msg.sender, "BaseModule: caller is not the capacity");
        _;
    }

    // ----------------- Public View -----------------
    function _core() internal view returns (ICore core) {
        return _getBaseModuleStorage().core;
    }
}
