pragma solidity ^0.8.17;

import "./IDealConfig.sol";

abstract contract DCInternalInterface {
    function _core() internal view virtual returns (Core);

    function _requiredStake() internal view virtual returns (uint);
}
