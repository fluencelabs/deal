pragma solidity ^0.8.17;

interface IPaymentManager {
    function getBalance(address owner) external view returns (uint256);

    function deposit(uint256 amount) external;

    function withdraw(uint256 amount) external;
}
