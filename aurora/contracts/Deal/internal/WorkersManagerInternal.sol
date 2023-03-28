// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/StorageSlot.sol";
import "../external/interfaces/IWorkersManager.sol";
import "./DealConfigInternal.sol";
import "./StatusControllerInternal.sol";
import "./WithdrawManagerInternal.sol";
import "./Types.sol";

abstract contract WorkersManagerInternal is DealConfigInternal, StatusControllerInternal, WithdrawManagerInternal {
    using SafeERC20 for IERC20;

    struct OwnerInfo {
        uint256 patsCount;
    }

    bytes32 private constant _PREFIX_PAT_SLOT = keccak256("network.fluence.WorkersManager.pat");

    uint256 private _currentWorkers;

    mapping(address => OwnerInfo) private _ownersInfo;

    uint256 private nextWorkerIndex;
    uint256 private freeIndexesCount;
    mapping(uint256 => PATId) private _patIdByIndex;

    function _getPATIndex(PATId id) internal view returns (uint256) {
        return _getPAT(id).index;
    }

    function _getPATOwner(PATId id) internal view returns (address) {
        return _getPAT(id).owner;
    }

    function _getNextWorkerIndex() internal view returns (uint256) {
        return nextWorkerIndex;
    }

    function _createPAT(PATId id, address owner, uint index) internal {
        uint256 patsCountByOwner = _ownersInfo[owner].patsCount;
        uint256 currentWorkers = _currentWorkers;
        PAT storage pat = _getPAT(id);

        require(currentWorkers < _targetWorkers(), "Target workers reached");
        require(patsCountByOwner < _maxWorkersPerProvider(), "Max workers per provider reached");
        require(pat.owner == address(0x00), "Id already used");

        uint256 requiredStake = _requiredStake();
        _fluenceToken().safeTransferFrom(owner, address(this), requiredStake);

        currentWorkers++;
        DealStatus status = _status();
        if (status == DealStatus.WaitingForWorkers && currentWorkers >= _minWorkers()) {
            status = DealStatus.Working;
            _changeStatus(status);
        }

        uint freeIndex;
        if (freeIndexesCount == 0) {
            freeIndex = nextWorkerIndex;
            nextWorkerIndex = freeIndex + 1;
        } else {
            require(PATId.unwrap(_patIdByIndex[index]) == bytes32(0), "Index isn't free");
            freeIndex = index;
        }

        _initPAT(pat, owner, freeIndex, requiredStake, _core().epochManager().currentEpoch());

        _patIdByIndex[freeIndex] = id;
        _ownersInfo[owner].patsCount = patsCountByOwner + 1;
        _currentWorkers = currentWorkers;
    }

    function _removePAT(PATId id) internal {
        PAT storage pat = _getPAT(id);
        address owner = pat.owner;

        require(owner != address(0x00), "PAT doesn't exist");

        _createWithdrawRequest(_fluenceToken(), owner, pat.collateral);

        uint256 currentWorkers = _currentWorkers - 1;

        if (_status() == DealStatus.Working && currentWorkers < _minWorkers()) {
            _changeStatus(DealStatus.WaitingForWorkers);
        }

        freeIndexesCount++;
        _ownersInfo[owner].patsCount--;
        _currentWorkers = currentWorkers;
        _patIdByIndex[pat.index] = PATId.wrap(bytes32(0));
        _clearPAT(pat);
    }

    function _getPAT(PATId id) private pure returns (PAT storage pat) {
        bytes32 bytes32Id = PATId.unwrap(id);

        bytes32 slot = bytes32(uint256(keccak256(abi.encodePacked(_PREFIX_PAT_SLOT, bytes32Id))) - 1);

        assembly {
            pat.slot := slot
        }

        return pat;
    }

    function _initPAT(PAT storage pat, address owner, uint index, uint collateral, uint created) private {
        pat.owner = owner;
        pat.index = index;
        pat.collateral = collateral;
        pat.created = created;
    }

    function _clearPAT(PAT storage pat) private {
        delete pat.owner;
        delete pat.collateral;
        delete pat.created;
        delete pat.index;
    }
}
