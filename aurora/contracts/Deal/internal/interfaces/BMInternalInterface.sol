pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../../Utils/WithdrawRequests.sol";
import "../../../Core/Core.sol";
import "../../external/interfaces/IDealConfig.sol";

abstract contract BMInternalInterface {
    function _getBalance(
        IERC20 token,
        address owner,
        uint256 balanceId
    ) internal view virtual returns (uint256);

    function _deposit(
        IERC20 token,
        address owner,
        uint256 balanceId,
        uint256 amount
    ) internal virtual;

    function _instantWithdraw(
        IERC20 token,
        address owner,
        uint256 balanceId,
        uint256 amount
    ) internal virtual;

    function _transferBalance(
        IERC20 token,
        address from,
        address to,
        uint256 fromBalanceId,
        uint256 toBalanceId,
        uint256 amount
    ) internal virtual;

    function _transferBetweenBalances(
        IERC20 token,
        address owner,
        uint256 fromBalanceId,
        uint256 toBalanceId,
        uint256 amount
    ) internal virtual;

    function _getUnlockedWithdrawAmountBy(
        IERC20 token,
        uint256 balanceId,
        uint256 timestamp,
        address owner
    ) internal view virtual returns (uint256);

    function _createWithdrawRequest(
        IERC20 token,
        uint256 amount,
        uint256 balanceId,
        address owner
    ) internal virtual;

    function _withdraw(
        IERC20 token,
        uint256 balanceId,
        address owner
    ) internal virtual;
}
