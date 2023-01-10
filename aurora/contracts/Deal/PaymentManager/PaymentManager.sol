pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./IPaymentManager.sol";
import "../DealConfig/DCInternalInterface.sol";
import "../BalanceManager/BMInternalInterface.sol";
import "../../Utils/Consts.sol";

abstract contract PaymentManager is
    IPaymentManager,
    BMInternalInterface,
    DCInternalInterface
{
    uint public constant PAYMENT_DURATION_IN_EPOCHS = 3;

    mapping(uint => bool) private _isExistGoldenParticleByEpoch;

    function deposit(uint256 amount) external {
        IERC20 token = _paymentToken();
        _deposit(token, msg.sender, DEFAULT_BALANCE, amount);
    }

    function withdraw(uint256 amount) external {
        uint currentEpoch = _core().epochManager().getEpoch();
        uint goldenParticleCount = 0;

        for (
            uint i = currentEpoch;
            i < currentEpoch + PAYMENT_DURATION_IN_EPOCHS;
            i++
        ) {
            if (!_isExistGoldenParticleByEpoch[i]) {
                continue;
            }

            goldenParticleCount++;
        }

        uint free = _getBalance(_paymentToken(), msg.sender, DEFAULT_BALANCE) -
            (_pricePerEpoch() * goldenParticleCount * 2);

        //TODO: if it's last amount in balance, golden particle receive sum without work confirmation

        require(amount >= free, "Not enough free balance");

        IERC20 token = _paymentToken();
        _deposit(token, msg.sender, DEFAULT_BALANCE, amount);
    }
}
