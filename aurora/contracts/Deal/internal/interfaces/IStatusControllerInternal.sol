pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../../Core/Core.sol";
import { DealStatus } from "../Types.sol";

abstract contract IStatusControllerInternal {
    function _status() internal view virtual returns (DealStatus);

    function _startWorkingEpoch() internal view virtual returns (uint256);
}

abstract contract IStatusControllerMutableInternal {
    function _changeStatus(DealStatus status_) internal virtual;
}
