// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "src/utils/LinkedListWithUniqueKeys.sol";
import "src/utils/OwnableUpgradableDiamond.sol";
import "src/core/interfaces/ICore.sol";
import "./interfaces/IConfig.sol";

contract Config is OwnableUpgradableDiamond, IConfig {
    using LinkedListWithUniqueKeys for LinkedListWithUniqueKeys.Bytes32List;

    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.deal.storage.v1.config")) - 1);

    struct ConfigStorage {
        ICore globalCore;
        uint256 creationBlock;
        CIDV1 appCID;
        // --- deal config ---
        IERC20 paymentToken;
        uint256 collateralPerWorker;
        uint256 minWorkers;
        uint256 targetWorkers;
        uint256 maxWorkersPerProvider;
        uint256 pricePerWorkerEpoch;
        CIDV1[] effectors;
    }

    ConfigStorage private _storage;

    function _getConfigStorage() private pure returns (ConfigStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ------------------ Initializer ------------------
    function __Config_init(
        ICore globalCore_,
        CIDV1 calldata appCID_,
        IERC20 paymentToken_,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 pricePerWorkerEpoch_,
        CIDV1[] calldata effectors_,
        address owner_
    ) internal onlyInitializing {
        __Ownable_init(owner_);

        __Config_init_unchained(
            globalCore_,
            paymentToken_,
            minWorkers_,
            targetWorkers_,
            maxWorkersPerProvider_,
            pricePerWorkerEpoch_,
            effectors_
        );

        _setAppCID(appCID_);
    }

    function __Config_init_unchained(
        ICore globalCore_,
        IERC20 paymentToken_,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 pricePerWorkerEpoch_,
        CIDV1[] calldata effectors_
    ) internal onlyInitializing {
        ConfigStorage storage configStorage = _getConfigStorage();

        configStorage.creationBlock = block.number;

        // --- init deal config ---
        configStorage.globalCore = globalCore_;
        configStorage.paymentToken = paymentToken_;
        configStorage.minWorkers = minWorkers_;
        configStorage.targetWorkers = targetWorkers_;
        configStorage.maxWorkersPerProvider = maxWorkersPerProvider_;
        configStorage.pricePerWorkerEpoch = pricePerWorkerEpoch_;

        for (uint256 i = 0; i < effectors_.length; i++) {
            configStorage.effectors.push(effectors_[i]);
        }
    }

    // ------------------ Modifiers ------------------
    modifier onlyCore() {
        require(msg.sender == address(_getConfigStorage().globalCore), "Config: caller is not the Core");
        _;
    }

    // ------------------ View Internal Functions ------------------
    function _globalCore() internal view returns (ICore) {
        return _getConfigStorage().globalCore;
    }

    // ------------------ Mutable Internal Functions ------------------
    function _setAppCID(CIDV1 calldata appCID_) internal {
        _getConfigStorage().appCID = appCID_;

        emit AppCIDChanged(appCID_);
    }

    // ------------------ View Functions ---------------------
    function paymentToken() public view returns (IERC20) {
        return _getConfigStorage().paymentToken;
    }

    function creationBlock() public view returns (uint256) {
        return _getConfigStorage().creationBlock;
    }

    function pricePerWorkerEpoch() public view returns (uint256) {
        return _getConfigStorage().pricePerWorkerEpoch;
    }

    function targetWorkers() public view returns (uint256) {
        return _getConfigStorage().targetWorkers;
    }

    function minWorkers() public view returns (uint256) {
        return _getConfigStorage().minWorkers;
    }

    function effectors() public view returns (CIDV1[] memory) {
        return _getConfigStorage().effectors;
    }

    function appCID() external view returns (CIDV1 memory) {
        return _getConfigStorage().appCID;
    }

    function maxWorkersPerProvider() public view returns (uint256) {
        return _getConfigStorage().maxWorkersPerProvider;
    }

    // ------------------ Mutable Functions ------------------
    function setAppCID(CIDV1 calldata appCID_) public onlyOwner {
        _setAppCID(appCID_);
    }
}
