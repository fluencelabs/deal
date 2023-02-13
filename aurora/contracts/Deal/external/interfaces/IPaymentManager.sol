pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IPaymentManager {
    function getPaymentBalance() external view returns (uint256);

    function depositToPaymentBalance(uint256 amount) external;

    //function withdrawFromPaymentBalance(IERC20 token, uint256 amount) external;
}
