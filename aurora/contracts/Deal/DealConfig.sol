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

    Core public core;
    bytes32 public subnetId;

    Settings public settings;
    Settings public newSettings;
    uint256 public settingsChangeTimestamp;

    bytes32 internal _settingsPropertyBits;
}

contract DealConfig is DealConfigState, Ownable {
    using SafeERC20 for IERC20;

    constructor(Core core_, bytes32 subnetId_, Settings memory settings_) {
        core = core_;
        subnetId = subnetId_;
        settings = settings_;
    }

    function fluenceToken() public view returns (IERC20) {
        return core.fluenceToken();
    }

    function aquaProxy() public view returns (AquaProxy) {
        return core.aquaProxy();
    }

    function setNewSettings(
        Settings calldata settings_,
        bytes32 propertyBits
    ) public onlyOwner {
        if (_bitExist(propertyBits, SettingPropertyBit.PaymentToken)) {
            newSettings.paymentToken = settings_.paymentToken;
        }

        if (_bitExist(propertyBits, SettingPropertyBit.PricePerEpoch)) {
            newSettings.pricePerEpoch = settings_.pricePerEpoch;
        }

        if (_bitExist(propertyBits, SettingPropertyBit.RequiredStake)) {
            newSettings.requiredStake = settings_.requiredStake;
        }

        _settingsPropertyBits = propertyBits;
        settingsChangeTimestamp =
            block.timestamp +
            core.updateSettingsTimeout();
    }

    function updateSettings() public onlyOwner {
        require(
            settingsChangeTimestamp != 0 &&
                settingsChangeTimestamp >= block.timestamp,
            "DealConfig: timeout not passed"
        );

        bytes32 propertyBits = _settingsPropertyBits;
        if (_bitExist(propertyBits, SettingPropertyBit.PaymentToken)) {
            settings.paymentToken = newSettings.paymentToken;
        }

        if (_bitExist(propertyBits, SettingPropertyBit.PricePerEpoch)) {
            settings.pricePerEpoch = newSettings.pricePerEpoch;
        }

        if (_bitExist(propertyBits, SettingPropertyBit.RequiredStake)) {
            settings.requiredStake = newSettings.requiredStake;
        }

        settingsChangeTimestamp = 0;
    }

    function _bitExist(
        bytes32 propertyBits,
        SettingPropertyBit bit
    ) internal pure returns (bool) {
        return (propertyBits & bytes32(uint256(bit)) != 0);
    }
}
