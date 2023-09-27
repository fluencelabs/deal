// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "../utils/Ownable.sol";
import "./interfaces/IGlobalCore.sol";
import "./interfaces/IDealFactory.sol";
import "./matcher/interfaces/IMatcher.sol";

contract GlobalCore is UUPSUpgradeable, Ownable, IGlobalCore {
    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.globalCore.storage.v1")) - 1);

    struct GlobalCoreStorage {
        IERC20 fluenceToken;
        uint256 epochDuration;
        IMatcher matcher;
        IDealFactory factory;
    }

    GlobalCoreStorage private _storage;

    function _getGlobalCoreStorage() private pure returns (GlobalCoreStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ------------------ Constuctor ------------------
    constructor() {
        _disableInitializers();
    }

    // ------------------ Initializer ------------------
    function initialize(IERC20 fluenceToken_, uint256 epochDuration_) external initializer {
        GlobalCoreStorage storage globalCoreStorage = _getGlobalCoreStorage();

        globalCoreStorage.fluenceToken = fluenceToken_;
        globalCoreStorage.epochDuration = epochDuration_;

        __Ownable_init(msg.sender);
    }

    // ------------------ Internal Mutable Functions ------------------
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    // ------------------ external View Functions ------------------
    function currentEpoch() external view returns (uint256) {
        return block.timestamp / _getGlobalCoreStorage().epochDuration;
    }

    function epochDuration() external view returns (uint256) {
        return _getGlobalCoreStorage().epochDuration;
    }

    function fluenceToken() external view returns (IERC20) {
        return _getGlobalCoreStorage().fluenceToken;
    }

    function matcher() external view returns (IMatcher) {
        return _getGlobalCoreStorage().matcher;
    }

    function factory() external view returns (IDealFactory) {
        return _getGlobalCoreStorage().factory;
    }

    // ------------------ external Mutable Functions ------------------
    function setMatcher(IMatcher matcher_) external onlyOwner {
        _getGlobalCoreStorage().matcher = matcher_;
    }

    function setFactory(IDealFactory factory_) external onlyOwner {
        _getGlobalCoreStorage().factory = factory_;
    }
}
