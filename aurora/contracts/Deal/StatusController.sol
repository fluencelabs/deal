// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./DealCore.sol";
import { DealStatus } from "./Types.sol";

contract StatusController {
    event StatusChanged(DealStatus newStatus);

    DealStatus private _status_;

    uint256 private _startWorkingEpoch_;

    function status() external view returns (DealStatus) {
        return _status_;
    }

    function startWorkingEpoch() external view returns (uint256) {
        return _startWorkingEpoch_;
    }

    function changeStatus(DealStatus status_) external {
        DealStatus oldStatus = _status_;

        if (oldStatus == status_) {
            return;
        }

        if (oldStatus != status_ && status_ == DealStatus.Working) {
            onStartWorking();
        } else if (oldStatus != status_ && status_ == DealStatus.WaitingForWorkers) {
            onEndWorking();
        }

        _status_ = status_;
        emit StatusChanged(status_);
    }

    function onStartWorking() private {
        _startWorkingEpoch_ = DealCore(msg.sender).globalConfig().epochManager().currentEpoch();
    }

    function onEndWorking() private {
        // spend reward? _spendReward();
        //TODO: transfer reward to workers
        _startWorkingEpoch_ = 0;
    }
}
