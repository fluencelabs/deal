// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../internal/interfaces/IDealConfigInternal.sol";
import "../internal/interfaces/IPaymentInternal.sol";
import "../internal/interfaces/IParticleInternal.sol";
import "../../Utils/Consts.sol";

abstract contract PaymentInternal is IDealConfigInternal, IPaymentInternal, IPaymentMutableInternal, IParticleInternal {
    using SafeERC20 for IERC20;

    uint256 public constant PAYMENT_DURATION_IN_EPOCHS = 3;

    mapping(IERC20 => uint256) private _balance;

    function _getPaymentBalance() internal view override returns (uint256) {
        return _balance[_paymentToken()];
    }

    function _depositToPaymentBalance(uint256 amount) internal override {
        IERC20 token = _paymentToken();
        token.safeTransferFrom(msg.sender, address(this), amount);
        _balance[_paymentToken()] += amount;
    }

    function _withdrawFromPaymentBalance(IERC20 token, uint256 amount) internal override {
        uint256 currentEpoch = _core().epochManager().currentEpoch();
        uint256 goldenParticleCount = 0;

        IERC20 paymentToken = _paymentToken();

        if (token != paymentToken) {
            return;
        }

        //TODO: отрезки
        for (uint256 i = currentEpoch; i < currentEpoch + PAYMENT_DURATION_IN_EPOCHS; i++) {
            if (!_existsGoldenParticlesInEpoch(i)) {
                continue;
            }

            goldenParticleCount++;
        }

        uint256 free = _balance[_paymentToken()] - (_pricePerEpoch() * goldenParticleCount * 2);

        //TODO: if it's last amount in balance, golden particle receive sum without work confirmation

        require(amount <= free, "Not enough free balance");

        _balance[_paymentToken()] -= amount;
        token.safeTransfer(msg.sender, amount);
    }
}
