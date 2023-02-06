pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IDealConfig.sol";
import "../internal/interfaces/DCInternalInterface.sol";

abstract contract DealConfig is IDealConfig, DCInternalInterface {
    using SafeERC20 for IERC20;

    function core() external view returns (Core) {
        return _core();
    }

    function requiredStake() external view returns (uint256) {
        return _requiredStake();
    }

    function paymentToken() external view returns (IERC20) {
        return _paymentToken();
    }

    function pricePerEpoch() external view returns (uint256) {
        return _pricePerEpoch();
    }

    function fluenceToken() external view returns (IERC20) {
        return _fluenceToken();
    }

    function appCID() external view returns (bytes32) {
        return _appCID();
    }

    function effectorWasmsCids() external view returns (bytes32[] memory) {
        return _effectorWasmsCids();
    }

    function minWorkers() external view returns (uint256) {
        return _minWorkers();
    }

    function maxWorkersPerProvider() external view returns (uint256) {
        return _maxWorkersPerProvider();
    }

    function targetWorkers() external view returns (uint256) {
        return _targetWorkers();
    }
}
