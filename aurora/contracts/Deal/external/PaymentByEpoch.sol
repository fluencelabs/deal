pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IPaymentManager.sol";
import "../internal/interfaces/IPaymentInternal.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract PaymentByEpoch is IPaymentManager, IPaymentInternal, IPaymentMutableInternal, Ownable {
    using SafeERC20 for IERC20;

    uint256 private _balance;

    function getPaymentBalance() public view returns (uint256) {
        return _getPaymentBalance();
    }

    function depositToPaymentBalance(uint256 amount) public {
        _depositToPaymentBalance(amount);
    }
    /*
    function withdrawFromPaymentBalance(IERC20 token, uint256 amount) public {
        _withdrawFromPaymentBalance(token, amount);
    }*/
}
