pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../Utils/WithdrawRequests.sol";
import "../../Core/Core.sol";
import "../DealConfig/DCInternalInterface.sol";
import "./IDepositManager.sol";
import "./DMInternalInterface.sol";

abstract contract DepositManagerInternal is
    DMInternalInterface,
    DCInternalInterface
{
    using WithdrawRequests for WithdrawRequests.Info;

    struct Balance {
        mapping(IERC20 => uint256) balanceByToken;
        mapping(IERC20 => WithdrawRequests.Info) withdrawRequestsByToken;
    }
    struct DepositState {
        mapping(address => Balance) balances;
    }

    DepositState private _depositManagerState;

    function _addBalance(
        IERC20 token,
        uint amount,
        address addr
    ) internal override {
        _depositManagerState.balances[addr].balanceByToken[token] += amount;
    }

    function _subBalance(
        IERC20 token,
        uint amount,
        address addr
    ) internal override {
        uint balance = _depositManagerState.balances[addr].balanceByToken[
            token
        ];
        require((balance - amount) > 0, "Not enough balance");

        _depositManagerState.balances[addr].balanceByToken[token] =
            balance -
            amount;
    }

    function _createWithdrawRequest(
        IERC20 token,
        uint amount,
        address addr
    ) internal override {
        WithdrawRequests.Info storage requests = _depositManagerState
            .balances[addr]
            .withdrawRequestsByToken[token];

        requests.createOrAddAmount(amount);
    }

    function _cancelWithdrawRequest(
        IERC20 token,
        uint timestamp,
        address addr
    ) internal override returns (uint) {
        WithdrawRequests.Info storage requests = _depositManagerState
            .balances[addr]
            .withdrawRequestsByToken[token];

        (WithdrawRequests.Request memory request, bool isOk) = requests.get(
            timestamp
        );
        require(isOk, "Request isn't exist");

        requests.remove(timestamp);

        return request.amount;
    }

    function _removeFirstRequest(
        IERC20 token,
        address addr
    ) internal override returns (uint) {
        WithdrawRequests.Info storage requests = _depositManagerState
            .balances[addr]
            .withdrawRequestsByToken[token];

        (WithdrawRequests.Request memory rq, bool isOk) = requests.first();

        IDealConfig.ConfigState memory config = _dealConfigState();
        require(isOk, "Request isn't exist");
        require(
            block.timestamp > (rq.timestamp + config.core.withdrawTimeout()),
            ""
        ); //TODO error text

        requests.remove(rq.timestamp);

        return rq.amount;
    }
}
