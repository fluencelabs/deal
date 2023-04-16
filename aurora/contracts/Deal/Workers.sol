// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/StorageSlot.sol";
import "../global/GlobalConfig.sol";
import "../utils/WithdrawRequests.sol";
import "./interfaces/IWorkers.sol";
import "./interfaces/IConfig.sol";
import "./interfaces/ICore.sol";
import "./StatusController.sol";
import "./base/ModuleBase.sol";
import "./base/Types.sol";

contract WorkersState {
    struct OwnerInfo {
        uint256 patsCount;
    }

    bytes32 internal constant _PREFIX_PAT_SLOT = keccak256("network.fluence.WorkersManager.pat");
    bytes32 internal constant _PAT_ID_PREFIX = keccak256("network.fluence.pat");

    uint256 internal _currentWorkers;

    mapping(address => OwnerInfo) internal _ownersInfo;
    mapping(address => WithdrawRequests.Requests) internal _requests;

    uint256 internal _nextWorkerIndex;
    uint256[] internal _freeIndexes;
    mapping(uint256 => PATId) internal _patIdByIndex;
}

contract Workers is WorkersState, ModuleBase, IWorkers {
    using WithdrawRequests for WithdrawRequests.Requests;
    using SafeERC20 for IERC20;

    event PATCreated(PATId id, address owner);

    // ---- Public view ----

    function getNextWorkerIndex() external view returns (uint256) {
        return _nextWorkerIndex;
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

    // ---- Public mutables ----

    function createPAT(address owner) external {
        uint256 patsCountByOwner = _ownersInfo[owner].patsCount;
        uint256 currentWorkers = _currentWorkers;

        ICore core = _core();
        IConfig config = core.getConfig();

        require(currentWorkers < config.targetWorkers(), "Target workers reached");
        require(patsCountByOwner < config.maxWorkersPerProvider(), "Max workers per provider reached");

        uint256 requiredStake = config.requiredStake();
        config.fluenceToken().safeTransferFrom(msg.sender, address(this), requiredStake);

        currentWorkers++;

        IStatusController statusController = core.getStatusController();

        DealStatus status = statusController.status();
        if (status == DealStatus.WaitingForWorkers && currentWorkers >= config.minWorkers()) {
            status = DealStatus.Working;
            statusController.changeStatus(status);
        }

        uint index;
        uint freeIndexLength = _freeIndexes.length;
        if (freeIndexLength > 0) {
            index = _freeIndexes[freeIndexLength - 1];
            _freeIndexes.pop();
        } else {
            index = _nextWorkerIndex;
        }

        PATId id = PATId.wrap(keccak256(abi.encodePacked(_PAT_ID_PREFIX, owner, index)));
        PAT storage pat = _getPAT(id);
        require(pat.owner == address(0x00), "Id already used");

        _initPAT(pat, owner, index, requiredStake, config.globalConfig().epochManager().currentEpoch());

        _patIdByIndex[index] = id;
        _ownersInfo[owner].patsCount = patsCountByOwner + 1;
        _currentWorkers = currentWorkers;

        emit PATCreated(id, owner);
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

        uint patIndex = pat.index;
        _freeIndexes.push(patIndex);

        _ownersInfo[owner].patsCount--;
        _currentWorkers = currentWorkers;
        _patIdByIndex[patIndex] = PATId.wrap(bytes32(0));
        _clearPAT(pat);
    }

    function withdraw(address owner) external {
        GlobalConfig globalConfig = _core().getConfig().globalConfig();

        uint256 amount = _requests[owner].confirmBy(block.timestamp - globalConfig.withdrawTimeout());

        globalConfig.fluenceToken().safeTransfer(owner, amount);
    }

    // ---- Private functions ----

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
