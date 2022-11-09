pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../AquaProxy.sol";
import "./PeersManager.sol";

contract Deal is PeersManager {
    using SafeERC20 for IERC20;

    uint public constant WITHDRAW_TIMEOUT = 1 minutes;
    uint public lastWithdrawRqTime;

    constructor(
        IERC20 paymentToken_,
        bytes32 airScriptHash_,
        Core core_,
        address owner_
    ) PeersManager(paymentToken_, airScriptHash_, core_, owner_) {}

    function deposit(uint amount) external onlyOwner {
        require(block.timestamp > lastWithdrawRqTime, "Deposit is locked");

        paymentToken.safeTransferFrom(msg.sender, address(this), amount);
    }

    function createWithdrawRequest() external onlyOwner {
        lastWithdrawRqTime = block.timestamp + WITHDRAW_TIMEOUT;
    }

    function withdraw() external onlyOwner {
        require(
            block.timestamp > lastWithdrawRqTime,
            "Withdraw request is not created or not expired delay"
        );

        uint balance = paymentToken.balanceOf(address(this));
        paymentToken.safeTransfer(msg.sender, balance);
    }
}
