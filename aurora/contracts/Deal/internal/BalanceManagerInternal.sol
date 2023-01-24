pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../Utils/WithdrawRequests.sol";
import "../../Core/Core.sol";
import "./interfaces/DCInternalInterface.sol";
import "./interfaces/BMInternalInterface.sol";

abstract contract BalanceManagerInternal is
    BMInternalInterface,
    DCInternalInterface
{
    using WithdrawRequests for WithdrawRequests.Requests;
    using SafeERC20 for IERC20;

    struct BalanceById {
        mapping(IERC20 => uint256) balanceByToken;
        mapping(IERC20 => WithdrawRequests.Requests) withdrawRequestsByToken;
    }

    struct Balance {
        mapping(uint256 => BalanceById) balanceById;
    }

    mapping(address => Balance) private _balances;

    // --------- Internal functions ---------

    function _getBalance(
        IERC20 token,
        address owner,
        uint256 balanceId
    ) internal view override returns (uint256) {
        return _balances[owner].balanceById[balanceId].balanceByToken[token];
    }

    function _deposit(
        IERC20 token,
        address owner,
        uint256 balanceId,
        uint256 amount
    ) internal override {
        _addBalance(token, owner, balanceId, amount);
        token.safeTransferFrom(owner, address(this), amount);
    }

    function _instantWithdraw(
        IERC20 token,
        address owner,
        uint256 balanceId,
        uint256 amount
    ) internal override {
        _subBalance(token, owner, balanceId, amount);
        token.safeTransfer(owner, amount);
    }

    function _transferBalance(
        IERC20 token,
        address from,
        address to,
        uint256 fromBalanceId,
        uint256 toBalanceId,
        uint256 amount
    ) internal override {
        _subBalance(token, from, fromBalanceId, amount);
        _addBalance(token, to, toBalanceId, amount);
    }

    function _transferBetweenBalances(
        IERC20 token,
        address owner,
        uint256 fromBalanceId,
        uint256 toBalanceId,
        uint256 amount
    ) internal override {
        _transferBalance(
            token,
            owner,
            owner,
            fromBalanceId,
            toBalanceId,
            amount
        );
    }

    function _getUnlockedWithdrawAmountBy(
        IERC20 token,
        uint256 balanceId,
        uint256 timestamp,
        address owner
    ) internal view override returns (uint256) {
        uint256 withdrawTimeout = _core().withdrawTimeout();

        WithdrawRequests.Requests storage requests = _balances[owner]
            .balanceById[balanceId]
            .withdrawRequestsByToken[token];

        return requests.getAmountBy(timestamp - withdrawTimeout);
    }

    function _createWithdrawRequest(
        IERC20 token,
        uint256 amount,
        uint256 balanceId,
        address owner
    ) internal override {
        _subBalance(token, owner, balanceId, amount);

        WithdrawRequests.Requests storage requests = _balances[owner]
            .balanceById[balanceId]
            .withdrawRequestsByToken[token];

        requests.push(amount);
    }

    function _withdraw(
        IERC20 token,
        uint256 balanceId,
        address owner
    ) internal override {
        WithdrawRequests.Requests storage requests = _balances[owner]
            .balanceById[balanceId]
            .withdrawRequestsByToken[token];

        uint256 withdrawTimeout = _core().withdrawTimeout();
        uint256 amount = requests.confirmBy(block.timestamp - withdrawTimeout);
        token.safeTransfer(owner, amount);
    }

    // --------- Private functions ---------

    function _addBalance(
        IERC20 token,
        address owner,
        uint256 balanceId,
        uint256 amount
    ) private {
        _balances[owner].balanceById[balanceId].balanceByToken[token] += amount;
    }

    function _subBalance(
        IERC20 token,
        address owner,
        uint256 balanceId,
        uint256 amount
    ) private {
        uint256 balance = _balances[owner]
            .balanceById[balanceId]
            .balanceByToken[token];

        require((balance - amount) >= 0, "Not enough balance");

        _balances[owner].balanceById[balanceId].balanceByToken[token] =
            balance -
            amount;
    }
}
