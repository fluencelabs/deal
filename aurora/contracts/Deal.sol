pragma solidity ^0.8.17;

import "./Staking.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Deal is Staking {
    using SafeERC20 for IERC20;

    uint public constant WITHDRAW_TIMEOUT = 1 hours;

    IERC20 public immutable paymentToken;

    bool public isStopped;
    uint public withdrawUnlockTime;

    mapping(uint256 => uint256) private paymentsBitMap;

    constructor(
        IERC20 paymentToken_,
        address daoAddress_,
        AquaProxy aquaProxy_,
        IERC20 fluenceToken_
    ) Staking(daoAddress_, aquaProxy_, fluenceToken_) {
        paymentToken = paymentToken_;
    }

    function deposit(uint amount) external {
        require(block.timestamp > withdrawUnlockTime, "Deposit is locked");

        if (!isStopped) {
            isStopped = true;
        }

        paymentToken.safeTransferFrom(msg.sender, address(this), amount);
    }

    function createWithdrawRequest() external {
        isStopped = true;
        withdrawUnlockTime = block.timestamp + WITHDRAW_TIMEOUT;
    }

    function withdraw() external {
        require(
            isStopped && block.timestamp > withdrawUnlockTime,
            "Withdraw request is not created or not expired delay"
        );

        uint balance = paymentToken.balanceOf(address(this));
        paymentToken.safeTransfer(msg.sender, balance);
    }

    function submitGoldenParticle(AquaProxy.Particle calldata particle)
        external
    {
        //verify
        //spend
    }
}
