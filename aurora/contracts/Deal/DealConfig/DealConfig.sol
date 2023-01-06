pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IDealConfig.sol";
import "./DealConfigInternal.sol";
import "./DCInternalInterface.sol";

contract DealConfig is
    IDealConfig,
    DealConfigInternal,
    DCInternalInterface,
    Ownable
{
    using SafeERC20 for IERC20;

    IDealConfig.ConfigState private _state;

    constructor(
        Core core_,
        bytes32 subnetId_,
        IDealConfig.Settings memory settings_
    ) {
        _state.core = core_;
        _state.subnetId = subnetId_;
        _state.settings = settings_;
    }

    function fluenceToken() external view returns (IERC20) {
        return _state.core.fluenceToken();
    }

    function aquaProxy() external view returns (AquaProxy) {
        return _state.core.aquaProxy();
    }

    function subnetId() external view returns (bytes32) {
        return _state.subnetId;
    }

    function settings() external view returns (IDealConfig.Settings memory) {
        return _state.settings;
    }

    function setNewSettings(
        IDealConfig.Settings calldata settings_,
        bytes32 propertyBits
    ) public onlyOwner {
        if (_bitExist(propertyBits, SettingPropertyBit.PaymentToken)) {
            _state.newSettings.paymentToken = settings_.paymentToken;
        }

        if (_bitExist(propertyBits, SettingPropertyBit.PricePerEpoch)) {
            _state.newSettings.pricePerEpoch = settings_.pricePerEpoch;
        }

        if (_bitExist(propertyBits, SettingPropertyBit.RequiredStake)) {
            _state.newSettings.requiredStake = settings_.requiredStake;
        }

        _state._settingsPropertyBits = propertyBits;
        _state.settingsChangeTimestamp =
            block.timestamp +
            _state.core.updateSettingsTimeout();
    }

    function updateSettings() public onlyOwner {
        require(
            _state.settingsChangeTimestamp != 0 &&
                _state.settingsChangeTimestamp >= block.timestamp,
            "DealConfig: timeout not passed"
        );

        bytes32 propertyBits = _state._settingsPropertyBits;
        if (_bitExist(propertyBits, SettingPropertyBit.PaymentToken)) {
            _state.settings.paymentToken = _state.newSettings.paymentToken;
        }

        if (_bitExist(propertyBits, SettingPropertyBit.PricePerEpoch)) {
            _state.settings.pricePerEpoch = _state.newSettings.pricePerEpoch;
        }

        if (_bitExist(propertyBits, SettingPropertyBit.RequiredStake)) {
            _state.settings.requiredStake = _state.newSettings.requiredStake;
        }

        _state.settingsChangeTimestamp = 0;
    }

    function _dealConfigState()
        internal
        view
        override
        returns (IDealConfig.ConfigState memory)
    {
        return _state;
    }
}
