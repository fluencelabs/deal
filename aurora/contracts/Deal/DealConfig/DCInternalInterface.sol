pragma solidity ^0.8.17;

import "./IDealConfig.sol";

abstract contract DCInternalInterface {
    function _dealConfigState()
        internal
        view
        virtual
        returns (IDealConfig.ConfigState memory);
}
