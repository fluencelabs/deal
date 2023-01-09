pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../Utils/WithdrawRequests.sol";
import "../../Core/Core.sol";
import "../DealConfig/DCInternalInterface.sol";
import "./IBalanceManager.sol";
import "./BMInternalInterface.sol";

abstract contract BalanceManagerInternal is
    BMInternalInterface,
    DCInternalInterface
{
    using WithdrawRequests for WithdrawRequests.Info;
    using SafeERC20 for IERC20;

    struct BalanceByType {
        mapping(IERC20 => uint256) balanceByToken;
        mapping(IERC20 => WithdrawRequests.Info) withdrawRequestsByToken;
    }

    struct Balance {
        mapping(uint => BalanceByType) balanceByType;
    }

    mapping(address => Balance) private _balances;

    // --------- Internal functions ---------

    function _getBalance(
        IERC20 token,
        address owner,
        uint balanceId
    ) internal view override returns (uint) {
        return _balances[owner].balanceByType[balanceId].balanceByToken[token];
    }

    function _deposit(
        IERC20 token,
        address owner,
        uint balanceId,
        uint amount
    ) internal override {
        _addBalance(token, owner, balanceId, amount);
        token.safeTransferFrom(owner, address(this), amount);
    }

    function _instantWithdraw(
        IERC20 token,
        address owner,
        uint balanceId,
        uint amount
    ) internal override {
        _subBalance(token, owner, balanceId, amount);
        token.safeTransfer(owner, amount);
    }

    function _transferBalance(
        IERC20 token,
        address from,
        address to,
        uint fromBalanceId,
        uint toBalanceId,
        uint amount
    ) internal override {
        _subBalance(token, from, fromBalanceId, amount);
        _addBalance(token, to, toBalanceId, amount);
    }

    function _transferBetweenBalances(
        IERC20 token,
        address owner,
        uint fromBalanceId,
        uint toBalanceId,
        uint amount
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

    function _createWithdrawRequest(
        IERC20 token,
        uint amount,
        uint balanceId,
        address owner
    ) internal override {
        _subBalance(token, owner, balanceId, amount);

        WithdrawRequests.Info storage requests = _balances[owner]
            .balanceByType[balanceId]
            .withdrawRequestsByToken[token];

        requests.createOrAddAmount(amount);
    }

    function _cancelWithdrawRequest(
        IERC20 token,
        uint timestamp,
        uint balanceId,
        address owner
    ) internal override {
        WithdrawRequests.Info storage requests = _balances[owner]
            .balanceByType[balanceId]
            .withdrawRequestsByToken[token];

        (WithdrawRequests.Request memory request, bool isOk) = requests.get(
            timestamp
        );
        require(isOk, "Request isn't exist");

        requests.remove(timestamp);

        _addBalance(token, owner, balanceId, request.amount);
    }

    function _withdrawByRequest(
        IERC20 token,
        uint balanceId,
        address owner
    ) internal override {
        WithdrawRequests.Info storage requests = _balances[owner]
            .balanceByType[balanceId]
            .withdrawRequestsByToken[token];

        (WithdrawRequests.Request memory rq, bool isOk) = requests.first();

        require(isOk, "Request isn't exist");
        require(
            block.timestamp > (rq.timestamp + _core().withdrawTimeout()),
            ""
        ); //TODO error text

        requests.remove(rq.timestamp);

        token.safeTransfer(owner, rq.amount);
    }

    // --------- Private functions ---------

    function _addBalance(
        IERC20 token,
        address owner,
        uint balanceId,
        uint amount
    ) private {
        _balances[owner].balanceByType[balanceId].balanceByToken[
            token
        ] += amount;
    }

    function _subBalance(
        IERC20 token,
        address owner,
        uint balanceId,
        uint amount
    ) private {
        uint balance = _balances[owner].balanceByType[balanceId].balanceByToken[
            token
        ];

        require((balance - amount) > 0, "Not enough balance");

        _balances[owner].balanceByType[balanceId].balanceByToken[token] =
            balance -
            amount;
    }
}
