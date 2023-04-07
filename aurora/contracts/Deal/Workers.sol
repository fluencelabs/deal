// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/StorageSlot.sol";
import "../Global/GlobalConfig.sol";
import "../Utils/WithdrawRequests.sol";
import "./interfaces/IWorkers.sol";
import "./interfaces/IConfig.sol";
import "./interfaces/ICore.sol";
import "./StatusController.sol";
import "./ModuleBase.sol";
import "./Types.sol";

contract Workers is ModuleBase, IWorkers {
    using WithdrawRequests for WithdrawRequests.Requests;
    using SafeERC20 for IERC20;

    struct OwnerInfo {
        uint256 patsCount;
    }

    bytes32 private constant _PREFIX_PAT_SLOT = keccak256("network.fluence.WorkersManager.pat");

    uint256 private _currentWorkers;

    mapping(address => OwnerInfo) private _ownersInfo;
    mapping(address => WithdrawRequests.Requests) private _requests;

    uint256 private nextWorkerIndex;
    uint256 private freeIndexesCount;
    mapping(uint256 => PATId) private _patIdByIndex;

    function getNextWorkerIndex() external view returns (uint256) {
        return nextWorkerIndex;
    }

    function getPATIndex(PATId id) external view returns (uint256) {
        return _getPAT(id).index;
    }

    function getPATOwner(PATId id) external view returns (address) {
        return _getPAT(id).owner;
    }

    function getUnlockedAmountBy(address owner, uint256 timestamp) external view returns (uint256) {
        GlobalConfig globalConfig = _core().getConfig().globalConfig();
        return _requests[owner].getAmountBy(timestamp - globalConfig.withdrawTimeout());
    }

    function createPAT(PATId id, address owner, uint index) external {
        uint256 patsCountByOwner = _ownersInfo[owner].patsCount;
        uint256 currentWorkers = _currentWorkers;
        PAT storage pat = _getPAT(id);

        ICore core = _core();
        IConfig config = core.getConfig();

        require(currentWorkers < config.targetWorkers(), "Target workers reached");
        require(patsCountByOwner < config.maxWorkersPerProvider(), "Max workers per provider reached");
        require(pat.owner == address(0x00), "Id already used");

        uint256 requiredStake = config.requiredStake();
        config.fluenceToken().safeTransferFrom(owner, address(this), requiredStake);

        currentWorkers++;

        IStatusController statusController = core.getStatusController();

        DealStatus status = statusController.status();
        if (status == DealStatus.WaitingForWorkers && currentWorkers >= config.minWorkers()) {
            status = DealStatus.Working;
            statusController.changeStatus(status);
        }

        uint freeIndex;
        if (freeIndexesCount == 0) {
            freeIndex = nextWorkerIndex;
            nextWorkerIndex = freeIndex + 1;
        } else {
            require(PATId.unwrap(_patIdByIndex[index]) == bytes32(0), "Index isn't free");
            freeIndex = index;
        }

        _initPAT(pat, owner, freeIndex, requiredStake, config.globalConfig().epochManager().currentEpoch());

        _patIdByIndex[freeIndex] = id;
        _ownersInfo[owner].patsCount = patsCountByOwner + 1;
        _currentWorkers = currentWorkers;
    }

    function removePAT(PATId id) external {
        PAT storage pat = _getPAT(id);
        address owner = pat.owner;

        require(owner != address(0x00), "PAT doesn't exist");

        ICore core = _core();
        IConfig config = core.getConfig();

        IStatusController statusController = core.getStatusController();

        _createWithdrawRequest(owner, pat.collateral);

        uint256 currentWorkers = _currentWorkers - 1;

        if (statusController.status() == DealStatus.Working && currentWorkers < config.minWorkers()) {
            statusController.changeStatus(DealStatus.WaitingForWorkers);
        }

        freeIndexesCount++;
        _ownersInfo[owner].patsCount--;
        _currentWorkers = currentWorkers;
        _patIdByIndex[pat.index] = PATId.wrap(bytes32(0));
        _clearPAT(pat);
    }

    function withdraw(address owner) external {
        GlobalConfig globalConfig = _core().getConfig().globalConfig();

        uint256 amount = _requests[owner].confirmBy(block.timestamp - globalConfig.withdrawTimeout());

        globalConfig.fluenceToken().safeTransfer(owner, amount);
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

    function _createWithdrawRequest(address owner, uint256 amount) private {
        _requests[owner].push(amount);
    }

    function _getPAT(PATId id) private pure returns (PAT storage pat) {
        bytes32 bytes32Id = PATId.unwrap(id);

        bytes32 slot = bytes32(uint256(keccak256(abi.encodePacked(_PREFIX_PAT_SLOT, bytes32Id))) - 1);

        assembly {
            pat.slot := slot
        }

        return pat;
    }
}
