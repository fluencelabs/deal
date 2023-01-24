pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IBalanceManager.sol";
import "../internal/interfaces/BMInternalInterface.sol";

abstract contract BalanceManager is BMInternalInterface, IBalanceManager {
    using SafeERC20 for IERC20;

    function getUnlockedWithdrawAmountBy(
        IERC20 token,
        uint256 balanceId,
        uint256 timestamp,
        address owner
    ) external view returns (uint256) {
        return _getUnlockedWithdrawAmountBy(token, balanceId, timestamp, owner);
    }

    function withdraw(IERC20 token, uint256 balanceId) external {
        _withdraw(token, balanceId, msg.sender);
    }
}
