pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../Core/AquaProxy.sol";
import "../Core/Core.sol";

contract DealConfigState {
    enum SettingPropertyBit {
        PaymentToken,
        PricePerEpoch,
        RequiredStake
    }
    struct Settings {
        IERC20 paymentToken;
        uint256 pricePerEpoch;
        uint256 requiredStake;
    }

    struct ConfigState {
        Core core;
        bytes32 subnetId;
        Settings settings;
        Settings newSettings;
        uint256 settingsChangeTimestamp;
        bytes32 _settingsPropertyBits;
    }

    ConfigState internal _dealConfigState;
}

contract DealConfigPrivate is DealConfigState {
    function _bitExist(
        bytes32 propertyBits,
        SettingPropertyBit bit
    ) internal pure returns (bool) {
        return (propertyBits & bytes32(uint256(bit)) != 0);
    }
}

contract DealConfig is DealConfigState, DealConfigPrivate, Ownable {
    using SafeERC20 for IERC20;

    constructor(Core core_, bytes32 subnetId_, Settings memory settings_) {
        _dealConfigState.core = core_;
        _dealConfigState.subnetId = subnetId_;
        _dealConfigState.settings = settings_;
    }

    function fluenceToken() public view returns (IERC20) {
        return _dealConfigState.core.fluenceToken();
    }

    function aquaProxy() public view returns (AquaProxy) {
        return _dealConfigState.core.aquaProxy();
    }

    function subnetId() public view returns (bytes32) {
        return _dealConfigState.subnetId;
    }

    function settings() public view returns (Settings memory) {
        return _dealConfigState.settings;
    }

    function setNewSettings(
        Settings calldata settings_,
        bytes32 propertyBits
    ) public onlyOwner {
        if (_bitExist(propertyBits, SettingPropertyBit.PaymentToken)) {
            _dealConfigState.newSettings.paymentToken = settings_.paymentToken;
        }

        if (_bitExist(propertyBits, SettingPropertyBit.PricePerEpoch)) {
            _dealConfigState.newSettings.pricePerEpoch = settings_
                .pricePerEpoch;
        }

        if (_bitExist(propertyBits, SettingPropertyBit.RequiredStake)) {
            _dealConfigState.newSettings.requiredStake = settings_
                .requiredStake;
        }

        _dealConfigState._settingsPropertyBits = propertyBits;
        _dealConfigState.settingsChangeTimestamp =
            block.timestamp +
            _dealConfigState.core.updateSettingsTimeout();
    }

    function updateSettings() public onlyOwner {
        require(
            _dealConfigState.settingsChangeTimestamp != 0 &&
                _dealConfigState.settingsChangeTimestamp >= block.timestamp,
            "DealConfig: timeout not passed"
        );

        bytes32 propertyBits = _dealConfigState._settingsPropertyBits;
        if (_bitExist(propertyBits, SettingPropertyBit.PaymentToken)) {
            _dealConfigState.settings.paymentToken = _dealConfigState
                .newSettings
                .paymentToken;
        }

        if (_bitExist(propertyBits, SettingPropertyBit.PricePerEpoch)) {
            _dealConfigState.settings.pricePerEpoch = _dealConfigState
                .newSettings
                .pricePerEpoch;
        }

        if (_bitExist(propertyBits, SettingPropertyBit.RequiredStake)) {
            _dealConfigState.settings.requiredStake = _dealConfigState
                .newSettings
                .requiredStake;
        }

        _dealConfigState.settingsChangeTimestamp = 0;
    }
}
