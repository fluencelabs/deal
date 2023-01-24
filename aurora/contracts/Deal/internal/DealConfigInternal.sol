pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/DCInternalInterface.sol";

abstract contract DealConfigInternal is DCInternalInterface {
    function _bitExist(bytes32 propertyBits, SettingPropertyBit bit)
        internal
        pure
        override
        returns (bool)
    {
        return (propertyBits & bytes32(1 << uint256(bit)) != 0);
    }
}
