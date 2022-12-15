pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../Utils/WithdrawRequests.sol";
import "../Core/Core.sol";
import "./DealConfig.sol";

contract DepositManagerState {
    struct Balance {
        mapping(IERC20 => uint256) balanceByToken;
        mapping(IERC20 => WithdrawRequests.Info) withdrawRequestsByToken;
    }
    struct DepositState {
        mapping(address => Balance) balances;
    }

    DepositState internal _depositManagerState;
}

abstract contract DepositManager is DepositManagerState, DealConfig {
    using SafeERC20 for IERC20;
    using WithdrawRequests for WithdrawRequests.Info;

    function deposit(IERC20 token, uint amount) external {
        _depositManagerState.balances[msg.sender].balanceByToken[
            token
        ] += amount;
        token.safeTransferFrom(msg.sender, address(this), amount);
    }

    function createWithdrawRequest(IERC20 token, uint amount) external {
        WithdrawRequests.Info storage requests = _depositManagerState
            .balances[msg.sender]
            .withdrawRequestsByToken[token];

        uint balance = _depositManagerState.balances[msg.sender].balanceByToken[
            token
        ];
        require((balance - amount) > 0, "Not enough balance");

        _depositManagerState.balances[msg.sender].balanceByToken[token] =
            balance -
            amount;
        requests.createOrAddAmount(amount);
    }

    function cancelWithdrawRequest(IERC20 token, uint timestamp) external {
        WithdrawRequests.Info storage requests = _depositManagerState
            .balances[msg.sender]
            .withdrawRequestsByToken[token];

        (WithdrawRequests.Request memory request, bool isOk) = requests.get(
            timestamp
        );
        require(isOk, "Request isn't exist");

        requests.remove(timestamp);
        _depositManagerState.balances[msg.sender].balanceByToken[
            token
        ] += request.amount;
    }

    function withdraw(IERC20 token) external {
        WithdrawRequests.Info storage requests = _depositManagerState
            .balances[msg.sender]
            .withdrawRequestsByToken[token];

        (WithdrawRequests.Request memory rq, bool isOk) = requests.first();

        require(isOk, "Request isn't exist");
        require(
            block.timestamp >
                (rq.timestamp + _dealConfigState.core.withdrawTimeout()),
            ""
        ); //TODO error text

        requests.remove(rq.timestamp);
        token.safeTransferFrom(address(this), msg.sender, rq.amount);
    }
}
