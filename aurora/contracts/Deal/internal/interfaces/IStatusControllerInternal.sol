pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../../Core/Core.sol";

abstract contract IStatusControllerInternal {
    enum Status {
        WaitingForWorkers,
        Working
    }

    function _status() internal view virtual returns (Status);

    function _startWorkingEpoch() internal view virtual returns (uint256);

    function _changeStatus(Status status_) internal virtual;
}
