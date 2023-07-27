// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/StorageSlot.sol";
import "./base/ModuleBase.sol";
import "../global/interfaces/IGlobalConfig.sol";
import "../utils/LinkedList.sol";
import "../utils/WithdrawRequests.sol";
import "./interfaces/IWorkersModule.sol";
import "./interfaces/IConfigModule.sol";
import "./interfaces/ICore.sol";
import "./interfaces/IStatusModule.sol";
import "./base/Types.sol";

contract WorkersModuleState {
    using LinkedList for LinkedList.Bytes32List;

    struct OwnerInfo {
        uint256 patCount;
        LinkedList.Bytes32List patsIds;
    }

    // ---- Events ----
    event PATCreated(bytes32 id, address owner);
    event PATRemoved(bytes32 id);

    event WorkerRegistred(bytes32 patId, bytes32 workerId);
    event WorkerUnregistred(bytes32 patId);

    event CollateralWithdrawn(address owner, uint256 amount);

    // ---- Constants ----

    bytes32 internal constant _PAT_PREFIX = keccak256("fluence.pat");

    // ---- Storage ----
    uint256 internal _patCount;

    mapping(address => OwnerInfo) internal _ownersInfo;
    mapping(bytes32 => PAT) internal _patByPATId;

    LinkedList.Bytes32List _patsIdsList;

    mapping(address => WithdrawRequests.Requests) internal _requests;
}

contract WorkersModuleInternal is WorkersModuleState, ModuleBase {
    using LinkedList for LinkedList.Bytes32List;
    using WithdrawRequests for WithdrawRequests.Requests;
    using SafeERC20 for IERC20;

    function _createWithdrawRequest(address owner, uint256 amount) internal {
        _requests[owner].push(amount);
    }

    function _createPAT(bytes32 peerId, address owner, address collateralPayer) internal {
        uint256 patCountByOwner = _ownersInfo[owner].patCount;
        uint256 patCount = _patCount;

        ICore core = _core();
        IConfigModule config = core.configModule();

        require(patCount < config.targetWorkers(), "Target workers reached");
        require(patCountByOwner < config.maxWorkersPerProvider(), "Max workers per provider reached");

        uint256 requiredCollateral = config.requiredCollateral();
        config.fluenceToken().safeTransferFrom(collateralPayer, address(this), requiredCollateral);

        patCount++;

        IStatusModule statusController = core.statusModule();

        {
            DealStatus status = statusController.status();
            if (status == DealStatus.WaitingForWorkers && patCount >= config.minWorkers()) {
                status = DealStatus.Working;
                statusController.changeStatus(status);
            }
        }

        bytes32 id = keccak256(abi.encodePacked(_PAT_PREFIX, owner, peerId, patCountByOwner));

        require(_patByPATId[id].owner == address(0x00), "Id already used");

        _patByPATId[id] = PAT({
            id: id,
            peerId: peerId,
            workerId: bytes32(0),
            owner: owner,
            collateral: requiredCollateral,
            created: config.globalConfig().epochManager().currentEpoch()
        });

        _ownersInfo[owner].patCount = patCountByOwner + 1;
        _patCount = patCount;

        _patsIdsList.push(id);

        emit PATCreated(id, owner);
    }
}

contract WorkersModule is WorkersModuleInternal, IWorkersModule {
    using LinkedList for LinkedList.Bytes32List;
    using WithdrawRequests for WithdrawRequests.Requests;
    using SafeERC20 for IERC20;

    function getPAT(bytes32 id) external view returns (PAT memory) {
        return _patByPATId[id];
    }

    function patCount() external view returns (uint256) {
        return _patCount;
    }

    // only for reading from frontend
    function getPATs() public view returns (PAT[] memory) {
        PAT[] memory pats = new PAT[](_patCount);

        uint256 index = 0;
        bytes32 patId = _patsIdsList.first();
        while (patId != bytes32(0)) {
            pats[index] = _patByPATId[patId];
            index++;

            patId = _patsIdsList.next(patId);
        }

        return pats;
    }

    function getUnlockedAmountBy(address owner, uint256 timestamp) external view returns (uint256) {
        IGlobalConfig globalConfig = _core().configModule().globalConfig();
        return _requests[owner].getAmountBy(timestamp - globalConfig.withdrawTimeout());
    }

    // ---- Public mutables ----

    function createPAT(address computeProvider, bytes32 peerId) external {
        require(address(_core().configModule().globalConfig().matcher()) == msg.sender, "Only matcher can call this method");

        _createPAT(peerId, computeProvider, msg.sender);
    }

    function setWorker(bytes32 patId, bytes32 workerId) external {
        PAT storage pat = _patByPATId[patId];

        if (pat.workerId != bytes32(0)) {
            emit WorkerUnregistred(patId);
        }

        pat.workerId = workerId;

        emit WorkerRegistred(patId, workerId);
    }

    function exit(bytes32 patId) external {
        PAT storage pat = _patByPATId[patId];
        address owner = pat.owner;

        require(owner == msg.sender, "PAT doesn't exist");

        ICore core = _core();
        IConfigModule config = core.configModule();

        IStatusModule statusController = core.statusModule();

        _createWithdrawRequest(owner, pat.collateral);

        uint256 newPatCount = _patCount - 1;

        if (statusController.status() == DealStatus.Working && newPatCount < config.minWorkers()) {
            statusController.changeStatus(DealStatus.WaitingForWorkers);
        }

        _ownersInfo[owner].patCount--;
        _patCount = newPatCount;

        delete _patByPATId[patId];

        _patsIdsList.remove(patId);

        emit PATRemoved(patId);
    }

    function withdrawCollateral(address owner) external {
        IGlobalConfig globalConfig = _core().configModule().globalConfig();

        uint256 amount = _requests[owner].confirmBy(block.timestamp - globalConfig.withdrawTimeout());

        globalConfig.fluenceToken().safeTransfer(owner, amount);

        emit CollateralWithdrawn(owner, amount);
    }
}
