pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IDealConfig.sol";
import "../internal/interfaces/DCInternalInterface.sol";

abstract contract DealConfig is IDealConfig, DCInternalInterface {
    using SafeERC20 for IERC20;

    function subnetId() external view returns (bytes32) {
        return _subnetId();
    }

    function requiredStake() external view returns (uint256) {
        return _requiredStake();
    }
}
