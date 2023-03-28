// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./DealConfigInternal.sol";
import { DealStatus } from "./Types.sol";

abstract contract StatusControllerInternal is DealConfigInternal {
    event StatusChanged(DealStatus newStatus);

    DealStatus private _status_;

    uint256 private _startWorkingEpoch_;

    function _status() internal view returns (DealStatus) {
        return _status_;
    }

    function _startWorkingEpoch() internal view returns (uint256) {
        return _startWorkingEpoch_;
    }

    function _changeStatus(DealStatus status_) internal {
        DealStatus oldStatus = _status_;

        if (oldStatus == status_) {
            return;
        }

        if (oldStatus != status_ && status_ == DealStatus.Working) {
            _onStartWorking();
        } else if (oldStatus != status_ && status_ == DealStatus.WaitingForWorkers) {
            _onEndWorking();
        }

        _status_ = status_;
        emit StatusChanged(status_);
    }

    function _onStartWorking() private {
        _startWorkingEpoch_ = _core().epochManager().currentEpoch();
    }

    function _onEndWorking() private {
        // spend reward? _spendReward();
        //TODO: transfer reward to workers
        _startWorkingEpoch_ = 0;
    }
}
