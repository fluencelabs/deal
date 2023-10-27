// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../utils/LinkedListWithUniqueKeys.sol";
import "./interfaces/IConfig.sol";
import "../core/interfaces/ICore.sol";
import "../utils/OwnableUpgradableDiamond.sol";

contract Config is OwnableUpgradableDiamond, IConfig {
    using LinkedListWithUniqueKeys for LinkedListWithUniqueKeys.Bytes32List;

    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.deal.storage.v1.config")) - 1);

    struct ConfigStorage {
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
        // --- access ---
        AccessType accessType;
        LinkedListWithUniqueKeys.Bytes32List accessList;
    }

    ConfigStorage private _storage;

    function _getConfigStorage() private pure returns (ConfigStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ------------------ Immutable ------------------
    ICore private immutable _globalCore_;

    // ------------------ Constructor ------------------
    // @custom:oz-upgrades-unsafe-allow state-variable-immutable constructor
    constructor(ICore globalCore_) {
        _globalCore_ = globalCore_;
    }

    // ------------------ Initializer ------------------
    function __Config_init(
        CIDV1 calldata appCID_,
        IERC20 paymentToken_,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 pricePerWorkerEpoch_,
        CIDV1[] calldata effectors_,
        AccessType accessType_,
        address[] calldata accessList_,
        address owner_
    ) internal onlyInitializing {
        __Ownable_init(owner_);

        __Config_init_unchained(
            paymentToken_,
            minWorkers_,
            targetWorkers_,
            maxWorkersPerProvider_,
            pricePerWorkerEpoch_,
            effectors_,
            accessType_,
            accessList_
        );

        _setAppCID(appCID_);
    }

    function __Config_init_unchained(
        IERC20 paymentToken_,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 pricePerWorkerEpoch_,
        CIDV1[] calldata effectors_,
        AccessType accessType_,
        address[] calldata accessList_
    ) internal onlyInitializing {
        ConfigStorage storage configStorage = _getConfigStorage();

        configStorage.creationBlock = block.number;

        // --- init deal config ---
        configStorage.paymentToken = paymentToken_;
        configStorage.minWorkers = minWorkers_;
        configStorage.targetWorkers = targetWorkers_;
        configStorage.maxWorkersPerProvider = maxWorkersPerProvider_;
        configStorage.pricePerWorkerEpoch = pricePerWorkerEpoch_;

        for (uint256 i = 0; i < effectors_.length; i++) {
            configStorage.effectors.push(effectors_[i]);
        }

        configStorage.accessType = accessType_;

        for (uint256 i = 0; i < accessList_.length; i++) {
            configStorage.accessList.push(bytes32(bytes20(accessList_[i])));
        }
    }

    // ------------------ View Internal Functions ------------------
    function _globalCore() internal view returns (ICore) {
        return _globalCore_;
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

    function accessType() public view returns (AccessType) {
        return _getConfigStorage().accessType;
    }

    function isInAccessList(address addr) public view returns (bool) {
        return _getConfigStorage().accessList.has(bytes32(bytes20(addr)));
    }

    function getAccessList() public view returns (address[] memory) {
        bytes32[] memory result = _getConfigStorage().accessList.toArray();

        /*
        TODO: mv to assembly
        uint256 length = result.length;
        assembly ("memory-safe") {
            return(result, mul(length, 32))
        }*/

        address[] memory result2 = new address[](result.length);
        for (uint256 i = 0; i < result.length; i++) {
            result2[i] = address(bytes20(result[i]));
        }

        return result2;
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

    function changeAccessType(AccessType accessType_) external onlyOwner {
        _getConfigStorage().accessType = accessType_;
    }

    function removeFromAccessList(address addr) external onlyOwner {
        _getConfigStorage().accessList.remove(bytes32(bytes20(addr)));
    }
}
