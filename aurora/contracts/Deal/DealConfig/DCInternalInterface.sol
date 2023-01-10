pragma solidity ^0.8.17;

import "./IDealConfig.sol";

abstract contract DCInternalInterface {
    function _core() internal view virtual returns (Core);

    function _requiredStake() internal view virtual returns (uint);

    function _paymentToken() internal view virtual returns (IERC20);

    function _pricePerEpoch() internal view virtual returns (uint);
}
