pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../../Core/Core.sol";

abstract contract DCInternalInterface {
    function _core() internal view virtual returns (Core);

    function _requiredStake() internal view virtual returns (uint256);

    function _paymentToken() internal view virtual returns (IERC20);

    function _pricePerEpoch() internal view virtual returns (uint256);

    function _fluenceToken() internal view virtual returns (IERC20);

    function _appCID() internal view virtual returns (string memory);

    function _effectorWasmsCids()
        internal
        view
        virtual
        returns (string[] memory);

    function _minWorkers() internal view virtual returns (uint256);

    function _maxWorkers() internal view virtual returns (uint256);

    function _targetWorkers() internal view virtual returns (uint256);

    function _setPricePerEpoch(uint256 pricePerEpoch_) internal virtual;

    function _setRequiredStake(uint256 requiredStake_) internal virtual;

    function _setAppCID(string calldata appCID_) internal virtual;
}
