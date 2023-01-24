pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IBalanceManager {
    function getUnlockedWithdrawAmountBy(
        IERC20 token,
        uint256 balanceId,
        uint256 timestamp,
        address owner
    ) external view returns (uint256);

    function withdraw(IERC20 token, uint256 balanceId) external;
}
