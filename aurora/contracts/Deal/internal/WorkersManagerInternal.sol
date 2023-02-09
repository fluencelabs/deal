pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/StorageSlot.sol";
import "../external/interfaces/IWorkersManager.sol";
import "./interfaces/IWorkersManagerInternal.sol";
import "./interfaces/IDealConfigInternal.sol";
import "./interfaces/IWithdrawManagerInternal.sol";
import "./interfaces/IStatusControllerInternal.sol";

abstract contract WorkersManagerInternal is
    IDealConfigInternal,
    IStatusControllerInternal,
    IWithdrawManagerInternal,
    IWorkersManagerInternal
{
    using SafeERC20 for IERC20;

    struct OwnerInfo {
        uint256 patsCount;
    }

    struct PAT {
        address owner;
        uint256 collateral;
        uint256 created;
    }

    bytes32 private constant _PREFIX_PAT_SLOT =
        keccak256("network.fluence.WorkersManager.pat");

    uint256 private _currentWorkers;
    mapping(address => OwnerInfo) private _ownersInfo;

    function _getPATOwner(IWorkersManager.PATId id)
        internal
        view
        override
        returns (address)
    {
        return _getPAT(id).owner;
    }

    function _createPAT(IWorkersManager.PATId id, address owner)
        internal
        override
    {
        PAT storage pat = _getPAT(id);
        uint256 patsCountByOwner = _ownersInfo[owner].patsCount;
        uint256 currentWorkers = _currentWorkers;

        require(currentWorkers < _targetWorkers(), "Target workers reached");
        require(
            patsCountByOwner < _maxWorkersPerProvider(),
            "Max workers per provider reached"
        );
        require(pat.owner == address(0x00), "Id already used");

        uint256 epoch = _core().epochManager().currentEpoch();
        uint256 requiredStake = _requiredStake();

        _fluenceToken().safeTransferFrom(owner, address(this), requiredStake);

        pat.owner = owner;
        pat.collateral = requiredStake;
        pat.created = epoch;

        _ownersInfo[owner].patsCount = patsCountByOwner + 1;

        currentWorkers++;
        _currentWorkers = currentWorkers;

        IStatusControllerInternal.Status status = _status();
        if (
            status == IStatusControllerInternal.Status.WaitingForWorkers &&
            currentWorkers >= _minWorkers()
        ) {
            status = IStatusControllerInternal.Status.Working;
            _changeStatus(status);
        }
    }

    function _removePAT(IWorkersManager.PATId id) internal override {
        PAT storage pat = _getPAT(id);
        address owner = pat.owner;

        _createWithdrawRequest(_fluenceToken(), owner, pat.collateral);

        _ownersInfo[owner].patsCount--;

        uint256 currentWorkers = _currentWorkers;
        currentWorkers--;
        _currentWorkers = currentWorkers;

        if (
            _status() == IStatusControllerInternal.Status.Working &&
            currentWorkers < _minWorkers()
        ) {
            _changeStatus(IStatusControllerInternal.Status.WaitingForWorkers);
        }

        delete pat.owner;
        delete pat.collateral;
        delete pat.created;
    }

    function _getPAT(IWorkersManager.PATId id)
        private
        pure
        returns (PAT storage pat)
    {
        bytes32 bytes32Id = IWorkersManager.PATId.unwrap(id);

        bytes32 slot = bytes32(
            uint256(keccak256(abi.encodePacked(_PREFIX_PAT_SLOT, bytes32Id))) -
                1
        );

        assembly {
            pat.slot := slot
        }
    }
}
