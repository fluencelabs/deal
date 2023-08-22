// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./Core.sol";
import "./base/ModuleBase.sol";
import "./interfaces/IStatusModule.sol";
import "./base/Types.sol";

contract StatusModuleState {
    DealStatus internal _status_;
    uint256 internal _startWorkingEpoch_;
}

contract StatusModuleInternal is ModuleBase, StatusModuleState {
    // ----------------- Private -----------------

    function _onStartWorking() internal {
        _startWorkingEpoch_ = _core().configModule().globalConfig().epochManager().currentEpoch();
    }

    function _onEndWorking() internal {
        _startWorkingEpoch_ = 0;
    }
}

contract StatusModule is StatusModuleInternal, IStatusModule {
    // ----------------- View -----------------
    function status() external view returns (DealStatus) {
        return _status_;
    }

    function startWorkingEpoch() external view returns (uint256) {
        return _startWorkingEpoch_;
    }

    // ----------------- Mutable -----------------
    function changeStatus(DealStatus status_) external onlyModule(Module.Workers) {
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
}
