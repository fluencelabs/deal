pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../internal/PaymentInternal.sol";

abstract contract Payment is PaymentInternal {
    function paymentBalance() external view returns (uint) {
        return _getPaymentBalance();
    }

    function withdrawFromPaymentBalance(uint256 amount) external {
        _withdrawFromPaymentBalance(amount);
    }

    function depositToPaymentBalance(uint256 amount) external {
        _depositToPaymentBalance(amount);
    }

    function commitParticle(Particle calldata particle) external {
        _commitParticle(particle);
    }

    function getReward(bytes32 particleHash, PATId patId) internal view returns (uint) {
        return _getReward(particleHash, patId);
    }
}
