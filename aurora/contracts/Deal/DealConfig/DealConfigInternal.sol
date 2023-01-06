pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IDealConfig.sol";

abstract contract DealConfigInternal {
    enum SettingPropertyBit {
        PaymentToken,
        PricePerEpoch,
        RequiredStake
    }

    function _bitExist(
        bytes32 propertyBits,
        SettingPropertyBit bit
    ) internal pure returns (bool) {
        return (propertyBits & bytes32(uint256(bit)) != 0);
    }
}
