pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../Utils/WithdrawRequests.sol";
import "../DealConfig/DCInternalInterface.sol";
import "./IDepositManager.sol";
import "./DepositManagerInternal.sol";

abstract contract DepositManager is IDepositManager, DepositManagerInternal {
    using SafeERC20 for IERC20;

    function deposit(IERC20 token, uint amount) external {
        _addBalance(token, amount, msg.sender);
        token.safeTransferFrom(msg.sender, address(this), amount);
    }

    function createWithdrawRequest(IERC20 token, uint amount) external {
        _subBalance(token, amount, msg.sender);
        _createWithdrawRequest(token, amount, msg.sender);
    }

    function cancelWithdrawRequest(IERC20 token, uint timestamp) external {
        uint amount = _cancelWithdrawRequest(token, timestamp, msg.sender);
        _addBalance(token, amount, msg.sender);
    }

    function withdraw(IERC20 token) external {
        uint amount = _removeFirstRequest(token, msg.sender);
        token.safeTransferFrom(address(this), msg.sender, amount);
    }
}
