/*
 * Fluence Compute Marketplace
 *
 * Copyright (C) 2024 Fluence DAO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation version 3 of the
 * License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

pragma solidity ^0.8.19;

import "src/utils/OwnableUpgradableDiamond.sol";
import "src/core/interfaces/ICore.sol";
import "./interfaces/IConfig.sol";

contract Config is OwnableUpgradableDiamond, IConfig {
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
        AccessType providersAccessType;
        mapping(address => bool) providersAccessMap;
    }

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
        address owner_,
        AccessType providersAccessType_,
        address[] calldata providersAccessList_
    ) internal onlyInitializing {
        __Ownable_init(owner_);

        __Config_init_unchained(
            globalCore_,
            paymentToken_,
            minWorkers_,
            targetWorkers_,
            maxWorkersPerProvider_,
            pricePerWorkerEpoch_,
            effectors_,
            providersAccessType_,
            providersAccessList_
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
        CIDV1[] calldata effectors_,
        AccessType providersAccessType_,
        address[] calldata providersAccessList_
    ) internal onlyInitializing {
        require(minWorkers_ > 0, "Config: minWorkers should be greater than 0");
        require(minWorkers_ <= targetWorkers_, "Config: minWorkers should be less or equal to targetWorkers");

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

        configStorage.providersAccessType = providersAccessType_;
        for (uint256 i = 0; i < providersAccessList_.length; i++) {
            configStorage.providersAccessMap[providersAccessList_[i]] = true;
        }
    }

    // ------------------ Modifiers ------------------
    modifier onlyCore() {
        require(msg.sender == address(_getConfigStorage().globalCore), "Config: caller is not the Core");
        _;
    }

    modifier onlyMarket() {
        require(msg.sender == address(_getConfigStorage().globalCore.market()), "Config: caller is not the Market");
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

    function providersAccessType() external view returns (AccessType) {
        return _getConfigStorage().providersAccessType;
    }

    function isProviderAllowed(address account) external view returns (bool) {
        ConfigStorage storage configStorage = _getConfigStorage();

        AccessType accessType = configStorage.providersAccessType;
        if (accessType == AccessType.NONE) {
            return true;
        }

        if (accessType == AccessType.WHITELIST) {
            return configStorage.providersAccessMap[account];
        }

        if (accessType == AccessType.BLACKLIST) {
            return !configStorage.providersAccessMap[account];
        }

        return false;
    }

    // ------------------ Mutable Functions ------------------
    function setAppCID(CIDV1 calldata appCID_) public onlyOwner {
        _setAppCID(appCID_);
    }

    function changeProvidersAccessType(AccessType accessType) public onlyOwner {
        ConfigStorage storage configStorage = _getConfigStorage();

        require(configStorage.providersAccessType != accessType, "Config: access type is already set");

        configStorage.providersAccessType = accessType;

        emit ProvidersAccessTypeChanged(accessType);
    }

    function addProviderToAccessList(address provider) public onlyOwner {
        ConfigStorage storage configStorage = _getConfigStorage();

        require(configStorage.providersAccessType != AccessType.NONE, "Config: access type is NONE");

        configStorage.providersAccessMap[provider] = true;

        emit ProviderAddedToAccessList(provider);
    }

    function removeProviderFromAccessList(address provider) public onlyOwner {
        ConfigStorage storage configStorage = _getConfigStorage();

        delete configStorage.providersAccessMap[provider];

        emit ProviderRemovedFromAccessList(provider);
    }
}
