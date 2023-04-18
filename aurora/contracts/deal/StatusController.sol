// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./Core.sol";
import "./base/ModuleBase.sol";
import "./interfaces/IStatusController.sol";
import "./base/Types.sol";

contract StatusController is ModuleBase, IStatusController {
    DealStatus private _status_;

    uint256 private _startWorkingEpoch_;

    // ----------------- View -----------------
    function status() external view returns (DealStatus) {
        return _status_;
    }

    function startWorkingEpoch() external view returns (uint256) {
        return _startWorkingEpoch_;
    }

    // ----------------- Mutable -----------------
    function changeStatus(DealStatus status_) external onlyModule(Module.Controller) {
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

    // ----------------- Private -----------------

    function _onStartWorking() private {
        _startWorkingEpoch_ = _core().getConfig().globalConfig().epochManager().currentEpoch();
    }

    function _onEndWorking() private {
        // spend reward? _spendReward();
        //TODO: transfer reward to workers
        _startWorkingEpoch_ = 0;
    }
}
