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
        uint256 patsCount;
        LinkedList.Bytes32List patsIds;
    }

    // ---- Events ----
    event PATCreated(PATId id, address owner);
    event PATRemoved(PATId id);

    event WorkerRegistred(PATId id, Multihash workerId);
    event WorkerUnregistred(PATId id);

    event CollateralWithdrawn(address owner, uint256 amount);

    // ---- Constants ----

    bytes32 internal constant _PAT_PREFIX = keccak256("fluence.pat");

    // ---- Storage ----
    uint256 internal _currentWorkers;

    LinkedList.Bytes32List _owners;
    mapping(address => OwnerInfo) internal _ownersInfo;
    mapping(PATId => PAT) internal _patByPATId;

    mapping(address => WithdrawRequests.Requests) internal _requests;
}

contract WorkersModuleInternal is WorkersModuleState, ModuleBase {
    using WithdrawRequests for WithdrawRequests.Requests;
    using SafeERC20 for IERC20;

    function _createWithdrawRequest(address owner, uint256 amount) internal {
        _requests[owner].push(amount);
    }

    function _createPAT(Multihash calldata peerId, address owner, address collateralPayer) internal {
        uint256 patsCountByOwner = _ownersInfo[owner].patsCount;
        uint256 currentWorkers = _currentWorkers;

        ICore core = _core();
        IConfigModule config = core.configModule();

        require(currentWorkers < config.targetWorkers(), "Target workers reached");
        require(patsCountByOwner < config.maxWorkersPerProvider(), "Max workers per provider reached");

        uint256 requiredCollateral = config.requiredCollateral();
        config.fluenceToken().safeTransferFrom(collateralPayer, address(this), requiredCollateral);

        currentWorkers++;

        IStatusModule statusController = core.statusModule();

        {
            DealStatus status = statusController.status();
            if (status == DealStatus.WaitingForWorkers && currentWorkers >= config.minWorkers()) {
                status = DealStatus.Working;
                statusController.changeStatus(status);
            }
        }

        PATId id = PATId.wrap(
            keccak256(abi.encodePacked(_PAT_PREFIX, owner, peerId.hashCode, peerId.length, peerId.value, patsCountByOwner))
        );

        require(_patByPATId[id].owner == address(0x00), "Id already used");

        _patByPATId[id] = PAT({
            peerId: peerId,
            workerId: Multihash({ hashCode: 0, length: 0, value: bytes32(0) }),
            owner: owner,
            collateral: requiredCollateral,
            created: config.globalConfig().epochManager().currentEpoch()
        });

        _ownersInfo[owner].patsCount = patsCountByOwner + 1;
        _currentWorkers = currentWorkers;

        emit PATCreated(id, owner);
    }
}

contract WorkersModule is WorkersModuleInternal, IWorkersModule {
    using WithdrawRequests for WithdrawRequests.Requests;
    using SafeERC20 for IERC20;

    function workersCount() external view returns (uint256) {
        return _currentWorkers;
    }

    function getPAT(PATId id) external view returns (PAT memory) {
        return _patByPATId[id];
    }

    /*
    function getWorkerIdByPATId(PATId id) external view returns (Multihash memory) {
        return _pat[id].workerId;
    }*/

    function getUnlockedAmountBy(address owner, uint256 timestamp) external view returns (uint256) {
        IGlobalConfig globalConfig = _core().configModule().globalConfig();
        return _requests[owner].getAmountBy(timestamp - globalConfig.withdrawTimeout());
    }

    // ---- Public mutables ----

    function createPAT(address computeProvider, Multihash calldata peerId) external {
        require(address(_core().configModule().globalConfig().matcher()) == msg.sender, "Only matcher can call this method");

        _createPAT(peerId, computeProvider, msg.sender);
    }

    function setWorker(PATId id, Multihash calldata workerId) external {
        PAT storage pat = _patByPATId[id];

        if (pat.workerId.hashCode != 0 && pat.workerId.length != 0 && pat.workerId.value != bytes32(0)) {
            emit WorkerUnregistred(id);
        }

        pat.workerId = Multihash({ hashCode: workerId.hashCode, length: workerId.length, value: workerId.value });

        emit WorkerRegistred(id, workerId);
    }

    function exit(PATId id) external {
        PAT storage pat = _patByPATId[id];
        address owner = pat.owner;

        require(owner == msg.sender, "PAT doesn't exist");

        ICore core = _core();
        IConfigModule config = core.configModule();

        IStatusModule statusController = core.statusModule();

        _createWithdrawRequest(owner, pat.collateral);

        uint256 currentWorkers = _currentWorkers - 1;

        if (statusController.status() == DealStatus.Working && currentWorkers < config.minWorkers()) {
            statusController.changeStatus(DealStatus.WaitingForWorkers);
        }

        _ownersInfo[owner].patsCount--;
        _currentWorkers = currentWorkers;

        delete _patByPATId[id];

        emit PATRemoved(id);
    }

    function withdrawCollateral(address owner) external {
        IGlobalConfig globalConfig = _core().configModule().globalConfig();

        uint256 amount = _requests[owner].confirmBy(block.timestamp - globalConfig.withdrawTimeout());

        globalConfig.fluenceToken().safeTransfer(owner, amount);

        emit CollateralWithdrawn(owner, amount);
    }
}
