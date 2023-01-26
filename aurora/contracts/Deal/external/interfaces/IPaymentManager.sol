pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IPaymentManager {
    function getBalance() external view returns (uint256);

    function deposit(uint256 amount) external;

    function withdrawPaymentBalance(IERC20 token, uint256 amount) external;
}
