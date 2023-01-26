pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IWithdrawCollateralManager {
    function getUnlockedCollateralBy(address owner, uint256 timestamp)
        external
        view
        returns (uint256);

    function withdraw(IERC20 token) external;
}
