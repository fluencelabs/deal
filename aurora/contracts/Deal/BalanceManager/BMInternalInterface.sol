pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../Utils/WithdrawRequests.sol";
import "../../Core/Core.sol";
import "../DealConfig/DealConfig.sol";

abstract contract BMInternalInterface {
    function _getBalance(
        IERC20 token,
        address owner,
        uint balanceId
    ) internal view virtual returns (uint);

    function _deposit(
        IERC20 token,
        address owner,
        uint balanceId,
        uint amount
    ) internal virtual;

    function _instantWithdraw(
        IERC20 token,
        address owner,
        uint balanceId,
        uint amount
    ) internal virtual;

    function _transferBalance(
        IERC20 token,
        address from,
        address to,
        uint fromBalanceId,
        uint toBalanceId,
        uint amount
    ) internal virtual;

    function _transferBetweenBalances(
        IERC20 token,
        address owner,
        uint fromBalanceId,
        uint toBalanceId,
        uint amount
    ) internal virtual;

    function _createWithdrawRequest(
        IERC20 token,
        uint amount,
        uint balanceId,
        address owner
    ) internal virtual;

    function _cancelWithdrawRequest(
        IERC20 token,
        uint timestamp,
        uint balanceId,
        address owner
    ) internal virtual;

    function _withdrawByRequest(
        IERC20 token,
        uint balanceId,
        address owner
    ) internal virtual;
}
