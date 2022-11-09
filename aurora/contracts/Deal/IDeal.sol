pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IDeal {
    function deposit(uint amount) external;

    function createWithdrawRequest() external;

    function withdraw() external;
}
