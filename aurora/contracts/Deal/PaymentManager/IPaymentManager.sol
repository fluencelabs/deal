pragma solidity ^0.8.17;

interface IPaymentManager {
    function deposit(uint256 amount) external;

    function withdraw(uint256 amount) external;
}
