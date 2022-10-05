pragma solidity ^0.8.17;

import "./Staking.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Deal is Staking {
    using SafeERC20 for IERC20;

    IERC20 private _paymentToken;
    mapping(uint256 => uint256) private paymentsBitMap;

    constructor(IERC20 paymentToken_) {
        _paymentToken = paymentToken_;
    }

    function paymentToken() external view returns (address) {
        return address(_paymentToken);
    }

    function deposit(uint amount) external {
        //Call to near
        _paymentToken.safeTransferFrom(msg.sender, address(this), amount);

        _callToNear("deposit");
    }

    function updateBalance(uint amount) external {
        uint balance = _paymentToken.balanceOf(address(this));

        _callToNear("updateBalance");
    }

    function withdraw(uint amount) external {
        _callToNear("withdraw");

        _paymentToken.safeTransfer(msg.sender, amount);
    }

    function spend(address validator) external {
        uint amount = getRewardAmount(
            validator
        );
        
        require(amount > 0, "");
        _paymentToken.safeTransfer(addr, amount);
        _withdrawReward();
    }

    function getRewardAmount(address addr)
        public
        view
        returns (
            uint,
        )
    {
        //TODO: call to near
        return (1000);
    }

    function getDebtAmount() public view returns (uint) {
        //TODO: call to near
        return 100;
    }

    function _withdrawReward(uint256 id) private {
        //TODO: near
    }
}
