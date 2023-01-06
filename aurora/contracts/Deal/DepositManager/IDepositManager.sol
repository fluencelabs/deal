pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IDepositManager {
    function deposit(IERC20 token, uint amount) external;

    function createWithdrawRequest(IERC20 token, uint amount) external;

    function cancelWithdrawRequest(IERC20 token, uint timestamp) external;

    function withdraw(IERC20 token) external;
}
