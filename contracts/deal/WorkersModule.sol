// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

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

    // ---- Structs ----

    struct OwnerInfo {
        uint256 patCount;
        LinkedList.Bytes32List patsIds;
    }

    // ---- Constants ----
    bytes32 internal constant _PAT_PREFIX = keccak256("fluence.pat");

    // ---- Events ----
    event PATCreated(bytes32 id, address owner);
    event PATRemoved(bytes32 id);

    event WorkerRegistred(bytes32 patId, bytes32 workerId);
    event WorkerUnregistred(bytes32 patId);

    event CollateralWithdrawn(address owner, uint256 amount);

    // ---- Storage ----
    uint256 internal _patCount;
    LinkedList.Bytes32List _freeIndexes;

    mapping(address => OwnerInfo) internal _ownersInfo;
    mapping(bytes32 => PAT) internal _patById;

    LinkedList.Bytes32List _patsIdsList;

    mapping(address => WithdrawRequests.Requests) internal _withdrawRequests;
}

contract WorkersModule is WorkersModuleState, ModuleBase, IWorkersModule {
    using LinkedList for LinkedList.Bytes32List;
    using WithdrawRequests for WithdrawRequests.Requests;
    using SafeERC20 for IERC20;

    // ---- Public view ----

    function getPAT(bytes32 id) external view returns (PAT memory) {
        return _patById[id];
    }

    function getPATCount() external view returns (uint256) {
        return _patCount;
    }

    function getPATs() public view returns (PAT[] memory) {
        PAT[] memory pats = new PAT[](_patCount);

        uint256 index = 0;
        bytes32 patId = _patsIdsList.first();
        while (patId != bytes32(0)) {
            pats[index] = _patById[patId];
            index++;

            patId = _patsIdsList.next(patId);
        }

        return pats;
    }

    function getUnlockedAmountBy(address owner, uint256 timestamp) external view returns (uint256) {
        IGlobalConfig globalConfig = _core().configModule().globalConfig();
        return _withdrawRequests[owner].getAmountBy(timestamp - globalConfig.withdrawTimeout());
    }

    // ---- Public Mutable ----
    function createPAT(address computeProvider, bytes32 peerId) external returns (bytes32) {
        ICore core = _core();

        // check params and limits
        IConfigModule config = core.configModule();

        uint256 globalPATCount = _patCount;
        require(globalPATCount < config.targetWorkers(), "Target workers reached");

        // transfer collateral
        uint256 requiredCollateral = config.requiredCollateral();
        config.fluenceToken().safeTransferFrom(msg.sender, address(this), requiredCollateral);

        // create PAT
        bytes32 id = keccak256(abi.encodePacked(_PAT_PREFIX, computeProvider, peerId));
        require(_patById[id].owner == address(0x00), "Id already used");

        uint256 patCountByOwner = _ownersInfo[computeProvider].patCount;

        _ownersInfo[computeProvider].patCount = ++patCountByOwner;
        _patCount = ++globalPATCount;

        uint index = uint(_freeIndexes.first());
        if (index == 0) {
            index = globalPATCount;
        }

        _patById[id] = PAT({
            id: id,
            peerId: peerId,
            index: index,
            workerId: bytes32(0),
            owner: computeProvider,
            collateral: requiredCollateral,
            created: block.number
        });

        _patsIdsList.push(id);

        // change status
        IStatusModule statusController = core.statusModule();
        {
            DealStatus status = statusController.status();
            if (status == DealStatus.WaitingForWorkers && globalPATCount >= config.minWorkers()) {
                status = DealStatus.Working;
                statusController.changeStatus(status);
            }
        }

        emit PATCreated(id, computeProvider);

        return id;
    }

    function setWorker(bytes32 patId, bytes32 workerId) external {
        PAT storage pat = _patById[patId];

        if (pat.workerId != bytes32(0)) {
            emit WorkerUnregistred(patId);
        }

        pat.workerId = workerId;

        emit WorkerRegistred(patId, workerId);
    }

    function exit(bytes32 patId) external {
        PAT storage pat = _patById[patId];

        // check owner
        address owner = pat.owner;
        require(owner == msg.sender, "PAT doesn't exist");

        // change pat count
        uint256 newPatCount = _patCount;
        _ownersInfo[owner].patCount--;
        _patCount = --newPatCount;

        // load modules
        ICore core = _core();
        IConfigModule config = core.configModule();
        IStatusModule statusController = core.statusModule();

        // change status
        if (statusController.status() == DealStatus.Working && newPatCount < config.minWorkers()) {
            statusController.changeStatus(DealStatus.WaitingForWorkers);
        }

        // return collateral and index
        _freeIndexes.push(bytes32(pat.index));
        _withdrawRequests[owner].push(pat.collateral);

        // remove PAT
        delete _patById[patId];
        _patsIdsList.remove(patId);

        emit PATRemoved(patId);
    }

    function withdrawCollateral(address owner) external {
        IGlobalConfig globalConfig = _core().configModule().globalConfig();

        uint256 amount = _withdrawRequests[owner].confirmBy(block.timestamp - globalConfig.withdrawTimeout());
        globalConfig.fluenceToken().safeTransfer(owner, amount);

        emit CollateralWithdrawn(owner, amount);
    }
}
