pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../internal/interfaces/IDealConfigInternal.sol";
import "../../internal/interfaces/IStatusControllerInternal.sol";
import "../../internal/interfaces/IPaymentInternal.sol";
import "../../../Utils/Consts.sol";

abstract contract PaymentByEpochInternal is IDealConfigInternal, IStatusControllerInternal, IPaymentInternal {
    using SafeERC20 for IERC20;

    uint256 private _balance;

    function _getPaymentBalance() internal view override returns (uint256) {
        return _balance - _getRewards();
    }

    function _depositToPaymentBalance(uint256 amount) internal override {
        IERC20 token = _paymentToken();
        token.safeTransferFrom(msg.sender, address(this), amount);
        _balance += amount;
    }

    function _withdrawFromPaymentBalance(IERC20 token, uint256 amount) internal override {
        require(_getPaymentBalance() >= amount, "PaymentByEpochInternal: Not enough balance");
        _balance -= amount;
        token.safeTransfer(msg.sender, amount);
    }

    function _spendReward() internal override {
        _balance -= _getRewards();
    }

    function _getRewards() internal view override returns (uint256) {
        if (_startWorkingEpoch() != 0) {
            uint256 currentEpoch = _core().epochManager().currentEpoch();
            uint256 epochsPassed = currentEpoch - _startWorkingEpoch();
            uint256 pricePerEpoch = _pricePerEpoch();
            uint256 totalPayment = epochsPassed * pricePerEpoch;
            if (totalPayment > _balance) {
                return _balance;
            }
            return totalPayment;
        }

        return 0;
    }
}
