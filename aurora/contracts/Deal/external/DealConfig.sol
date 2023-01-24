pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IDealConfig.sol";
import "../internal/interfaces/DCInternalInterface.sol";

abstract contract DealConfig is IDealConfig, DCInternalInterface, Ownable {
    using SafeERC20 for IERC20;

    Core private _coreAddr;
    bytes32 private _subnetId;
    Settings private _settings;
    Settings private _newSettings;
    uint256 private _settingsChangeTimestamp;
    bytes32 private _settingsPropertyBits;

    constructor(
        Core core_,
        bytes32 subnetId_,
        IDealConfig.Settings memory settings_
    ) {
        _coreAddr = core_;
        _subnetId = subnetId_;
        _settings = settings_;
    }

    function fluenceToken() external view returns (IERC20) {
        return _coreAddr.fluenceToken();
    }

    function aquaProxy() external view returns (AquaProxy) {
        return _coreAddr.aquaProxy();
    }

    function subnetId() external view returns (bytes32) {
        return _subnetId;
    }

    function settings() external view returns (IDealConfig.Settings memory) {
        return _settings;
    }

    function setNewSettings(
        IDealConfig.Settings calldata settings_,
        uint256 propertyBitsUint
    ) public onlyOwner {
        bytes32 propertyBits = bytes32(propertyBitsUint);

        if (_bitExist(propertyBits, SettingPropertyBit.PaymentToken)) {
            _newSettings.paymentToken = settings_.paymentToken;
        }

        if (_bitExist(propertyBits, SettingPropertyBit.PricePerEpoch)) {
            _newSettings.pricePerEpoch = settings_.pricePerEpoch;
        }

        if (_bitExist(propertyBits, SettingPropertyBit.RequiredStake)) {
            _newSettings.requiredStake = settings_.requiredStake;
        }

        _settingsPropertyBits = propertyBits;
        _settingsChangeTimestamp =
            block.timestamp +
            _coreAddr.updateSettingsTimeout();
    }

    function updateSettings() public onlyOwner {
        require(
            _settingsChangeTimestamp != 0 &&
                block.timestamp >= _settingsChangeTimestamp,
            "DealConfig: timeout not passed"
        );

        bytes32 propertyBits = _settingsPropertyBits;
        if (_bitExist(propertyBits, SettingPropertyBit.PaymentToken)) {
            _settings.paymentToken = _newSettings.paymentToken;
        }

        if (_bitExist(propertyBits, SettingPropertyBit.PricePerEpoch)) {
            _settings.pricePerEpoch = _newSettings.pricePerEpoch;
        }

        if (_bitExist(propertyBits, SettingPropertyBit.RequiredStake)) {
            _settings.requiredStake = _newSettings.requiredStake;
        }

        _settingsChangeTimestamp = 0;
    }

    // --------- Internal functions ---------

    function _core() internal view override returns (Core) {
        return _coreAddr;
    }

    function _requiredStake() internal view override returns (uint256) {
        return _settings.requiredStake;
    }

    function _paymentToken() internal view override returns (IERC20) {
        return _settings.paymentToken;
    }

    function _pricePerEpoch() internal view override returns (uint256) {
        return _settings.pricePerEpoch;
    }
}
