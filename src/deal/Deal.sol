// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/MulticallUpgradeable.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";
import "src/core/interfaces/ICore.sol";
import "src/core/modules/market/interfaces/IMarket.sol";
import "src/utils/OwnableUpgradableDiamond.sol";
import "./DealStorageUtils.sol";
import "./WorkerManager.sol";
import "./interfaces/IDeal.sol";
import "./interfaces/IConfig.sol";
import "forge-std/console.sol";

contract Deal is MulticallUpgradeable, WorkerManager, IDeal {
    using SafeERC20 for IERC20;
    using DealStorageUtils for DealStorageUtils.Balance;

    // ------------------ Types ------------------
    struct ComputeUnitPaymentInfo {
        uint256 startedEpoch;
        uint256 gapsDelta;
    }

    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.deal.storage.v1")) - 1);

    struct DealStorage {
        uint256 totalBalance;
        uint256 lockedBalance;
        uint256 gapsEpochCount;
        uint256 maxPaidEpoch;
        uint256 lastCommitedEpoch;
        mapping(bytes32 => ComputeUnitPaymentInfo) cUnitPaymentInfo;
        bool isEnded;
        uint256 endedEpoch;
        uint256 protocolVersion;
    }

    function _getDealStorage() private pure returns (DealStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ------------------ Modifiers ------------------
    modifier onlyCoreOwner() {
        require(msg.sender == OwnableUpgradableDiamond(address(_globalCore())).owner(), "Only core owner can call");
        _;
    }

    // ------------------ Constructor ---------------------
    constructor() {
        _disableInitializers();
    }

    // ------------------ Init ------------------
    function initialize(
        ICore globalCore_,
        CIDV1 calldata appCID_,
        IERC20 paymentToken_,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 pricePerWorkerEpoch_,
        CIDV1[] calldata effectors_,
        AccessType providersAccessType_,
        address[] calldata providersAccessList_,
        uint256 protocolVersion_
    ) public initializer {
        __WorkerManager_init(
            globalCore_,
            appCID_,
            paymentToken_,
            minWorkers_,
            targetWorkers_,
            maxWorkersPerProvider_,
            pricePerWorkerEpoch_,
            effectors_,
            msg.sender,
            providersAccessType_,
            providersAccessList_
        );
        _getDealStorage().protocolVersion = protocolVersion_;
        __Multicall_init();

        uint256 prevEpoch = _globalCore().currentEpoch() - 1;

        DealStorage storage dealStorage = _getDealStorage();
        dealStorage.maxPaidEpoch = 0;
        dealStorage.lastCommitedEpoch = prevEpoch;
    }

    // ------------------ Privat Functions ------------------
    function _preCommitPeriod(
        DealStorageUtils.Balance memory balance,
        uint256 prevEpoch,
        uint256 maxPaidEpoch,
        uint256 lastCommitedEpoch,
        uint256 currentWorkerCount,
        uint256 pricePerWorkerEpoch_
    ) internal pure {
        if (lastCommitedEpoch == prevEpoch) {
            return;
        }

        // if prevEpoch > maxPaidEpoch, this means that the deposit has run out and we need to write off balance and write gaps
        if (prevEpoch > maxPaidEpoch) {
            // but if lastCommitedEpoch >= maxPaidEpoch this means that we spend balance before and we need only write gaps
            if (lastCommitedEpoch >= maxPaidEpoch) {
                balance.setGapsEpochCount(balance.getGapsEpochCount() + (prevEpoch - lastCommitedEpoch));
            } else {
                // if lastCommitedEpoch < maxPaidEpoch, this means that we didn't record it before
                uint256 amount = (maxPaidEpoch - lastCommitedEpoch) * pricePerWorkerEpoch_ * currentWorkerCount;

                balance.setTotalBalance(balance.getTotalBalance() - amount); // write off balance
                balance.setLockedBalance(balance.getLockedBalance() + amount); // record locked balance for rewards
                balance.setGapsEpochCount(balance.getGapsEpochCount() + (prevEpoch - maxPaidEpoch)); // write gaps
            }
        } else {
            // prevEpoch <= maxPaidEpoch, this means that we we need to record only active epoches and write off balances. We don't have a gaps.
            uint256 amount = (prevEpoch - lastCommitedEpoch) * pricePerWorkerEpoch_ * currentWorkerCount;

            balance.setTotalBalance(balance.getTotalBalance() - amount); // write off balance
            balance.setLockedBalance(balance.getLockedBalance() + amount); // record locked balance for rewards
        }
    }

    function _postCommitPeriod(
        DealStorageUtils.Balance memory balance,
        uint256 prevEpoch,
        uint256 prevWorkerCount,
        uint256 newWorkerCount,
        uint256 minWorkerCount,
        uint256 pricePerWorkerEpoch_
    ) internal {
        DealStorage storage dealStorage = _getDealStorage();

        if (prevWorkerCount >= minWorkerCount && newWorkerCount < minWorkerCount) {
            dealStorage.maxPaidEpoch = 0;
            emit MaxPaidEpochUpdated(0);
        } else if (newWorkerCount >= minWorkerCount) {
            uint256 maxPaidEpoch = prevEpoch;
            if (newWorkerCount != 0) {
                maxPaidEpoch = prevEpoch + balance.getTotalBalance() / (pricePerWorkerEpoch_ * newWorkerCount);
            }

            dealStorage.maxPaidEpoch = maxPaidEpoch;
            emit MaxPaidEpochUpdated(maxPaidEpoch);
        }

        balance.commitToStorage(dealStorage);
        dealStorage.lastCommitedEpoch = prevEpoch;
    }

    // ------------------ Public View Functions ------------------
    function getStatus() public view returns (Status) {
        DealStorage storage dealStorage = _getDealStorage();

        if (dealStorage.isEnded) {
            return Status.ENDED;
        }

        uint256 freeBalance = getFreeBalance();
        uint256 currentWorkerCount = getWorkerCount();
        uint256 maxPaidEpoch = dealStorage.maxPaidEpoch;

        if (maxPaidEpoch != 0 && _globalCore().currentEpoch() > dealStorage.maxPaidEpoch) {
            return Status.INSUFFICIENT_FUNDS;
        } else if (freeBalance < _globalCore().minDealDepositedEpoches() * pricePerWorkerEpoch() * targetWorkers()) {
            return Status.SMALL_BALANCE;
        } else if (currentWorkerCount < minWorkers()) {
            return Status.NOT_ENOUGH_WORKERS;
        } else {
            return Status.ACTIVE;
        }
    }

    function getFreeBalance() public virtual view returns (uint256) {
        DealStorage storage dealStorage = _getDealStorage();

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(
            balance,
            _globalCore().currentEpoch() - 1,
            dealStorage.maxPaidEpoch,
            dealStorage.lastCommitedEpoch,
            getWorkerCount(),
            pricePerWorkerEpoch()
        );

        return balance.getTotalBalance();
    }

    function getRewardAmount(bytes32 computeUnitId) public view returns (uint256) {
        DealStorage storage dealStorage = _getDealStorage();
        ComputeUnitPaymentInfo storage computeUnitPaymentInfo = dealStorage.cUnitPaymentInfo[computeUnitId];

        uint256 prevEpoch = _globalCore().currentEpoch() - 1;

        if (prevEpoch < computeUnitPaymentInfo.startedEpoch) {
            return 0;
        }

        uint256 workerCount = getWorkerCount();
        uint256 pricePerWorkerEpoch_ = pricePerWorkerEpoch();

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(
            balance,
            prevEpoch,
            dealStorage.maxPaidEpoch,
            dealStorage.lastCommitedEpoch,
            workerCount,
            pricePerWorkerEpoch_
        );

        uint256 reward = (
            (prevEpoch - computeUnitPaymentInfo.startedEpoch)
                - (balance.getGapsEpochCount() - computeUnitPaymentInfo.gapsDelta)
        ) * pricePerWorkerEpoch_;

        return reward;
    }

    function getMaxPaidEpoch() public view returns (uint256) {
        return _getDealStorage().maxPaidEpoch;
    }

    function getProtocolVersion() public view returns (uint256) {
        return _getDealStorage().protocolVersion;
    }

    // ------------------ Public Mutable Functions ------------------
    function deposit(uint256 amount) external onlyOwner {
        DealStorage storage dealStorage = _getDealStorage();

        uint256 prevEpoch = _globalCore().currentEpoch() - 1;
        uint256 workerCount = getWorkerCount();
        uint256 pricePerWorkerEpoch_ = pricePerWorkerEpoch();

        uint256 maxPaidEpoch = dealStorage.maxPaidEpoch;

        require(getStatus() != Status.ENDED, "Deal is ended");

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(
            balance, prevEpoch, maxPaidEpoch, dealStorage.lastCommitedEpoch, workerCount, pricePerWorkerEpoch_
        );

        balance.setTotalBalance(balance.getTotalBalance() + amount);

        _postCommitPeriod(balance, prevEpoch, workerCount, workerCount, minWorkers(), pricePerWorkerEpoch_);

        paymentToken().safeTransferFrom(msg.sender, address(this), amount);

        emit Deposited(amount);
    }

    function withdraw(uint256 amount) external onlyOwner {
        DealStorage storage dealStorage = _getDealStorage();

        uint256 currentEpoch = _globalCore().currentEpoch();
        uint256 prevEpoch = currentEpoch - 1;
        uint256 workerCount = getWorkerCount();
        uint256 pricePerWorkerEpoch_ = pricePerWorkerEpoch();

        if (dealStorage.isEnded) {
            require(
                currentEpoch > dealStorage.endedEpoch + _globalCore().minDealDepositedEpoches(),
                "Can't withdraw before 2 epochs after deal end"
            );
            dealStorage.totalBalance -= amount;
        } else {
            DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
            _preCommitPeriod(
                balance,
                prevEpoch,
                dealStorage.maxPaidEpoch,
                dealStorage.lastCommitedEpoch,
                workerCount,
                pricePerWorkerEpoch_
            );

            balance.setTotalBalance(balance.getTotalBalance() - amount);

            uint256 minBalance = _globalCore().minDealDepositedEpoches() * pricePerWorkerEpoch_ * targetWorkers();
            require(balance.getTotalBalance() >= minBalance, "Free balance needs to cover minimum 2 epochs");

            _postCommitPeriod(balance, prevEpoch, workerCount, workerCount, minWorkers(), pricePerWorkerEpoch_);
        }

        paymentToken().safeTransfer(msg.sender, amount);

        emit Withdrawn(amount);
    }

    function withdrawRewards(bytes32 computeUnitId) external {
        DealStorage storage dealStorage = _getDealStorage();
        ComputeUnitPaymentInfo storage computeUnitPaymentInfo = dealStorage.cUnitPaymentInfo[computeUnitId];

        uint256 prevEpoch = _globalCore().currentEpoch() - 1;
        if (prevEpoch < computeUnitPaymentInfo.startedEpoch) {
            return;
        }

        ComputeUnit memory unit = getComputeUnit(computeUnitId);
        IMarket market = _globalCore().market();
        IMarket.ComputePeer memory marketPeer = market.getComputePeer(unit.peerId);
        IMarket.Offer memory marketOffer = market.getOffer(marketPeer.offerId);

        require(
            marketPeer.owner == msg.sender || marketOffer.provider == msg.sender, "Only provider or owner can withdraw"
        );

        uint256 workerCount = getWorkerCount();
        uint256 pricePerWorkerEpoch_ = pricePerWorkerEpoch();

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(
            balance,
            prevEpoch,
            dealStorage.maxPaidEpoch,
            dealStorage.lastCommitedEpoch,
            workerCount,
            pricePerWorkerEpoch_
        );

        uint256 globalGapsEpochCount = balance.getGapsEpochCount();

        uint256 reward = (
            (prevEpoch - computeUnitPaymentInfo.startedEpoch)
                - (globalGapsEpochCount - computeUnitPaymentInfo.gapsDelta)
        ) * pricePerWorkerEpoch_;

        require(reward > 0, "No rewards");

        computeUnitPaymentInfo.startedEpoch = prevEpoch;
        computeUnitPaymentInfo.gapsDelta = globalGapsEpochCount;

        balance.setLockedBalance(balance.getLockedBalance() - reward);

        //TODO: fix double check prev state
        _postCommitPeriod(balance, prevEpoch, workerCount, workerCount, minWorkers(), pricePerWorkerEpoch_);

        paymentToken().safeTransfer(msg.sender, reward);

        emit RewardWithdrawn(computeUnitId, reward);
    }

    function addComputeUnit(address computeProvider, bytes32 computeUnitId, bytes32 peerId) public onlyMarket {
        require(getStatus() != Status.ENDED, "Deal is ended");

        _addComputeUnit(computeProvider, computeUnitId, peerId);
    }

    function removeComputeUnit(bytes32 computeUnitId) public onlyMarket {
        DealStorage storage dealStorage = _getDealStorage();

        uint256 prevEpoch = _globalCore().currentEpoch() - 1;
        //TODO: fix double get worker count
        uint256 prevWorkerCount = getWorkerCount();
        uint256 newWorkerCount = _removeComputeUnit(computeUnitId);
        uint256 pricePerWorkerEpoch_ = pricePerWorkerEpoch();
        uint256 maxPaidEpoch = _getDealStorage().maxPaidEpoch;

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(
            balance, prevEpoch, maxPaidEpoch, dealStorage.lastCommitedEpoch, prevWorkerCount, pricePerWorkerEpoch_
        );

        _postCommitPeriod(balance, prevEpoch, prevWorkerCount, newWorkerCount, minWorkers(), pricePerWorkerEpoch_);
    }

    function setWorker(bytes32 computeUnitId, bytes32 workerId) public {
        require(getStatus() != Status.ENDED, "Deal is ended");
        require(workerId != bytes32(0), "WorkerId can't be empty");

        DealStorage storage dealStorage = _getDealStorage();

        ICore core = _globalCore();
        ComputeUnit memory unit = getComputeUnit(computeUnitId);
        IMarket.ComputePeer memory marketPeer = core.market().getComputePeer(unit.peerId);

        require(msg.sender == unit.provider || msg.sender == marketPeer.owner, "Only provider or owner can set worker");

        //TODO: fix double get worker count
        uint256 prevWorkerCount = getWorkerCount();
        uint256 newWorkerCounts = _setWorker(computeUnitId, workerId);

        if (prevWorkerCount == newWorkerCounts) {
            return;
        }

        uint256 currentEpoch = core.currentEpoch();
        uint256 prevEpoch = currentEpoch - 1;
        uint256 pricePerWorkerEpoch_ = pricePerWorkerEpoch();

        ComputeUnitPaymentInfo storage computeUnitPaymentInfo = dealStorage.cUnitPaymentInfo[computeUnitId];

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(
            balance, prevEpoch, dealStorage.maxPaidEpoch, dealStorage.lastCommitedEpoch, prevWorkerCount, pricePerWorkerEpoch_
        );

        _postCommitPeriod(balance, prevEpoch, prevWorkerCount, newWorkerCounts, minWorkers(), pricePerWorkerEpoch_);

        computeUnitPaymentInfo.startedEpoch = currentEpoch;
        computeUnitPaymentInfo.gapsDelta = balance.getGapsEpochCount();
    }

    function stop() external onlyOwner {
        require(getStatus() != Status.ENDED, "Deal is not active");

        DealStorage storage dealStorage = _getDealStorage();

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        uint256 currentEpoch = _globalCore().currentEpoch();
        uint256 maxPaidEpoch = _getDealStorage().maxPaidEpoch;
        uint256 pricePerWorkerEpoch_ = pricePerWorkerEpoch();

        uint256 workerCount = getWorkerCount();

        _preCommitPeriod(
            balance, currentEpoch, maxPaidEpoch, dealStorage.lastCommitedEpoch, workerCount, pricePerWorkerEpoch_
        );
        _postCommitPeriod(balance, currentEpoch, workerCount, workerCount, minWorkers(), pricePerWorkerEpoch_);

        //TODO: fix double write maxPaidEpoch
        dealStorage.maxPaidEpoch = currentEpoch;
        emit MaxPaidEpochUpdated(currentEpoch);

        dealStorage.isEnded = true;
        dealStorage.endedEpoch = currentEpoch;

        emit DealEnded(currentEpoch);
    }
}
