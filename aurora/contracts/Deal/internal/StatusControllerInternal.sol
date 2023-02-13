pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IStatusControllerInternal.sol";
import "./interfaces/IPaymentInternal.sol";
import "./interfaces/IDealConfigInternal.sol";

abstract contract StatusControllerInternal is
    IDealConfigInternal,
    IStatusControllerInternal,
    IPaymentInternal
{
    event StatusChanged(IStatusControllerInternal.Status newStatus);

    IStatusControllerInternal.Status private _status_;

    uint256 private _startWorkingEpoch_;

    function _status()
        internal
        view
        override
        returns (IStatusControllerInternal.Status)
    {
        return _status_;
    }

    function _startWorkingEpoch() internal view override returns (uint256) {
        return _startWorkingEpoch_;
    }

    function _changeStatus(IStatusControllerInternal.Status status_)
        internal
        override
    {
        IStatusControllerInternal.Status oldStatus = _status_;

        if (oldStatus == status_) {
            return;
        }

        if (
            oldStatus != status_ &&
            status_ == IStatusControllerInternal.Status.Working
        ) {
            _onStartWorking();
        } else if (
            oldStatus != status_ &&
            status_ == IStatusControllerInternal.Status.WaitingForWorkers
        ) {
            _onEndWorking();
        }

        _status_ = status_;
        emit StatusChanged(status_);
    }

    function _onStartWorking() private {
        _startWorkingEpoch_ = _core().epochManager().currentEpoch();
    }

    function _onEndWorking() private {
        _spendReward();
        //TODO: transfer reward to workers
        _startWorkingEpoch_ = 0;
    }
}
