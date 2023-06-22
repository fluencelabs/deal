// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/StorageSlot.sol";
import "./base/ModuleBase.sol";
import "../global/interfaces/IGlobalConfig.sol";
import "../utils/WithdrawRequests.sol";
import "./interfaces/IWorkersModule.sol";
import "./interfaces/IConfigModule.sol";
import "./interfaces/ICore.sol";
import "./interfaces/IStatusModule.sol";
import "./base/Types.sol";

contract WorkersModuleState {
    struct OwnerInfo {
        uint256 patsCount;
    }

    event PATCreated(PATId id, address owner);
    event PATRemoved(PATId id);

    event PDTSet(PATId id, string peerId, string workerId);
    event PDTRemoved(PATId id);

    event CollateralWithdrawn(address owner, uint256 amount);

    bytes32 internal constant _PREFIX_PAT_SLOT = keccak256("network.fluence.WorkersManager.pat");
    bytes32 internal constant _PAT_ID_PREFIX = keccak256("network.fluence.pat");

    uint256 internal _currentWorkers;

    mapping(address => OwnerInfo) internal _ownersInfo;
    mapping(address => WithdrawRequests.Requests) internal _requests;

    uint256 internal _nextWorkerIndex;
    uint256[] internal _freeIndexes;
    mapping(uint256 => PATId) internal _patIdByIndex;
    mapping(PATId => PDT) internal _pdtByPATId;
}

contract WorkersModuleInternal is WorkersModuleState, ModuleBase {
    using WithdrawRequests for WithdrawRequests.Requests;
    using SafeERC20 for IERC20;

    function _initPAT(PAT storage pat, address owner, uint index, uint collateral, uint created) internal {
        pat.owner = owner;
        pat.index = index;
        pat.collateral = collateral;
        pat.created = created;
    }

    function _getPAT(PATId id) internal pure returns (PAT storage pat) {
        bytes32 bytes32Id = PATId.unwrap(id);

        bytes32 slot = bytes32(uint256(keccak256(abi.encodePacked(_PREFIX_PAT_SLOT, bytes32Id))) - 1);

        assembly {
            pat.slot := slot
        }

        return pat;
    }

    function _clearPAT(PAT storage pat) internal {
        delete pat.owner;
        delete pat.collateral;
        delete pat.created;
        delete pat.index;
    }

    function _createWithdrawRequest(address owner, uint256 amount) internal {
        _requests[owner].push(amount);
    }

    function _createPAT(address owner, address collateralPayer) internal {
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

        uint index;
        uint freeIndexLength = _freeIndexes.length;
        if (freeIndexLength > 0) {
            index = _freeIndexes[freeIndexLength - 1];
            _freeIndexes.pop();
        } else {
            index = _nextWorkerIndex;
            _nextWorkerIndex++;
        }

        PATId id = PATId.wrap(keccak256(abi.encodePacked(_PAT_ID_PREFIX, owner, index)));
        PAT storage pat = _getPAT(id);
        require(pat.owner == address(0x00), "Id already used");

        _initPAT(pat, owner, index, requiredCollateral, config.globalConfig().epochManager().currentEpoch());

        _patIdByIndex[index] = id;
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

    function getNextWorkerIndex() external view returns (uint256) {
        return _nextWorkerIndex;
    }

    function getPATIndex(PATId id) external view returns (uint256) {
        return _getPAT(id).index;
    }

    function getPATOwner(PATId id) external view returns (address) {
        return _getPAT(id).owner;
    }

    function getPDT(PATId id) external view returns (string memory peerId, string memory workerId) {
        return (_pdtByPATId[id].peerId, _pdtByPATId[id].workerId);
    }

    function getUnlockedAmountBy(address owner, uint256 timestamp) external view returns (uint256) {
        IGlobalConfig globalConfig = _core().configModule().globalConfig();
        return _requests[owner].getAmountBy(timestamp - globalConfig.withdrawTimeout());
    }

    // ---- Public mutables ----

    function join() external {
        _createPAT(msg.sender, msg.sender);
    }

    function joinViaMatcher(address owner) external {
        require(address(_core().configModule().globalConfig().matcher()) == msg.sender, "Only matcher can call this method");

        _createPAT(owner, msg.sender);
    }

    function exit(PATId id) external {
        PAT storage pat = _getPAT(id);
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

        uint patIndex = pat.index;
        _freeIndexes.push(patIndex);

        _ownersInfo[owner].patsCount--;
        _currentWorkers = currentWorkers;
        _patIdByIndex[patIndex] = PATId.wrap(bytes32(0));
        _clearPAT(pat);

        delete _pdtByPATId[id];

        emit PDTRemoved(id);
        emit PATRemoved(id);
    }

    function withdrawCollateral(address owner) external {
        IGlobalConfig globalConfig = _core().configModule().globalConfig();

        uint256 amount = _requests[owner].confirmBy(block.timestamp - globalConfig.withdrawTimeout());

        globalConfig.fluenceToken().safeTransfer(owner, amount);

        emit CollateralWithdrawn(owner, amount);
    }

    function setPDT(PATId id, string calldata peerId, string calldata workerId) external {
        _pdtByPATId[id] = PDT(peerId, workerId);

        emit PDTSet(id, peerId, workerId);
    }
}
