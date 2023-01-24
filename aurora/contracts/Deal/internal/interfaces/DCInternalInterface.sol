pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../../Core/Core.sol";

abstract contract DCInternalInterface {
    enum SettingPropertyBit {
        PaymentToken,
        PricePerEpoch,
        RequiredStake
    }

    function _core() internal view virtual returns (Core);

    function _requiredStake() internal view virtual returns (uint256);

    function _paymentToken() internal view virtual returns (IERC20);

    function _pricePerEpoch() internal view virtual returns (uint256);

    function _bitExist(bytes32 propertyBits, SettingPropertyBit bit)
        internal
        pure
        virtual
        returns (bool);
}
