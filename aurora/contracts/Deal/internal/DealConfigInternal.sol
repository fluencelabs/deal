pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/DCInternalInterface.sol";

abstract contract DealConfigInternal is DCInternalInterface {
    Core private immutable _coreAddr;
    bytes32 private immutable _subnetId_;
    IERC20 private immutable _fluenceToken_;
    IERC20 private immutable _paymentToken_;

    uint256 private _pricePerEpoch_;
    uint256 private _requiredStake_;

    constructor(
        Core core_,
        bytes32 subnetId_,
        IERC20 fluenceToken_,
        IERC20 paymentToken_,
        uint256 pricePerEpoch_,
        uint256 requiredStake_
    ) {
        _coreAddr = core_;
        _subnetId_ = subnetId_;
        _fluenceToken_ = fluenceToken_;
        _paymentToken_ = paymentToken_;
        _pricePerEpoch_ = pricePerEpoch_;
        _requiredStake_ = requiredStake_;
    }

    function _core() internal view override returns (Core) {
        return _coreAddr;
    }

    function _requiredStake() internal view override returns (uint256) {
        return _requiredStake_;
    }

    function _paymentToken() internal view override returns (IERC20) {
        return _paymentToken_;
    }

    function _pricePerEpoch() internal view override returns (uint256) {
        return _pricePerEpoch_;
    }

    function _fluenceToken() internal view override returns (IERC20) {
        return _fluenceToken_;
    }

    function _subnetId() internal view override returns (bytes32) {
        return _subnetId_;
    }

    function _setPricePerEpoch(uint256 pricePerEpoch_) internal override {
        _pricePerEpoch_ = pricePerEpoch_;
    }

    function _setRequiredStake(uint256 requiredStake_) internal override {
        _requiredStake_ = requiredStake_;
    }
}
