pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IDealConfigInternal.sol";

abstract contract DealConfigInternal is IDealConfigInternal {
    Core private immutable _coreAddr;
    IERC20 private immutable _fluenceToken_;
    IERC20 private immutable _paymentToken_;

    uint256 private _pricePerEpoch_;
    uint256 private _requiredStake_;
    string private _appCID_;
    uint256 private _minWorkers_;
    uint256 private _maxWorkersPerProvider_;
    uint256 private _targetWorkers_;
    string[] private _effectorWasmsCids_;

    constructor(
        Core core_,
        address fluenceToken_,
        address paymentToken_,
        uint256 pricePerEpoch_,
        uint256 requiredStake_,
        uint256 minWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 targetWorkers_,
        string memory appCID_,
        string[] memory effectorWasmsCids_
    ) {
        _coreAddr = core_;
        _fluenceToken_ = IERC20(fluenceToken_);
        _paymentToken_ = IERC20(paymentToken_);
        _pricePerEpoch_ = pricePerEpoch_;
        _requiredStake_ = requiredStake_;
        _minWorkers_ = minWorkers_;
        _maxWorkersPerProvider_ = maxWorkersPerProvider_;
        _targetWorkers_ = targetWorkers_;
        _appCID_ = appCID_;
        _effectorWasmsCids_ = effectorWasmsCids_;
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

    function _appCID() internal view override returns (string memory) {
        return _appCID_;
    }

    function _effectorWasmsCids()
        internal
        view
        override
        returns (string[] memory)
    {
        return _effectorWasmsCids_;
    }

    function _minWorkers() internal view override returns (uint256) {
        return _minWorkers_;
    }

    function _maxWorkersPerProvider() internal view override returns (uint256) {
        return _maxWorkersPerProvider_;
    }

    function _targetWorkers() internal view override returns (uint256) {
        return _targetWorkers_;
    }

    function _setPricePerEpoch(uint256 pricePerEpoch_) internal override {
        _pricePerEpoch_ = pricePerEpoch_;
    }

    function _setRequiredStake(uint256 requiredStake_) internal override {
        _requiredStake_ = requiredStake_;
    }

    function _setAppCID(string calldata appCID_) internal override {
        _appCID_ = appCID_;
    }
}
