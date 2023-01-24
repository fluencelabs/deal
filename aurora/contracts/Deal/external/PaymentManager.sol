pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IPaymentManager.sol";
import "../internal/interfaces/DCInternalInterface.sol";
import "../internal/interfaces/BMInternalInterface.sol";
import "../../Utils/Consts.sol";

abstract contract PaymentManager is
    IPaymentManager,
    BMInternalInterface,
    DCInternalInterface
{
    uint256 public constant PAYMENT_DURATION_IN_EPOCHS = 3;

    mapping(uint256 => bool) private _isExistGoldenParticleByEpoch;

    function getBalance(address owner) external view returns (uint256) {
        return _getBalance(_paymentToken(), owner, DEFAULT_BALANCE);
    }

    function deposit(uint256 amount) external {
        IERC20 token = _paymentToken();
        _deposit(token, msg.sender, DEFAULT_BALANCE, amount);
    }

    function withdrawDeposit(uint256 amount) external {
        uint256 currentEpoch = _core().epochManager().getEpoch();
        uint256 goldenParticleCount = 0;

        for (
            uint256 i = currentEpoch;
            i < currentEpoch + PAYMENT_DURATION_IN_EPOCHS;
            i++
        ) {
            if (!_isExistGoldenParticleByEpoch[i]) {
                continue;
            }

            goldenParticleCount++;
        }

        uint256 free = _getBalance(
            _paymentToken(),
            msg.sender,
            DEFAULT_BALANCE
        ) - (_pricePerEpoch() * goldenParticleCount * 2);

        //TODO: if it's last amount in balance, golden particle receive sum without work confirmation

        require(amount <= free, "Not enough free balance");

        IERC20 token = _paymentToken();
        _instantWithdraw(token, msg.sender, DEFAULT_BALANCE, amount);
    }
}
