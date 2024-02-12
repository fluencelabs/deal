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

contract Deal is MulticallUpgradeable, WorkerManager, IDeal {
    using BitMaps for BitMaps.BitMap;
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
        address[] calldata providersAccessList_
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
        __Multicall_init();
    }

    // ------------------ Privat Functions ------------------
    function _calculateMaxPaidEpoch(
        uint256 currentEpoch,
        uint256 totalBalance,
        uint256 pricePerWorkerEpoch_,
        uint256 workerCount
    ) internal pure returns (uint256) {
        if (workerCount == 0) {
            return currentEpoch;
        }

        return currentEpoch + totalBalance / (pricePerWorkerEpoch_ * workerCount) - 1;
    }

    function _preCommitPeriod(
        DealStorageUtils.Balance memory balance,
        uint256 currentEpoch,
        uint256 maxPaidEpoch,
        uint256 lastCommitedEpoch,
        uint256 currentWorkerCount,
        uint256 pricePerWorkerEpoch_
    ) internal pure {
        if (maxPaidEpoch == 0 || (currentEpoch > maxPaidEpoch && lastCommitedEpoch >= maxPaidEpoch)) {
            // if maxPaidEpoch equals 0 we need to write gaps. also if currentEpoch is more than maxPaidEpoch,
            // this means that the deposit has run out and we need to write off balance and write gaps
            // but if lastCommitedEpoch >= maxPaidEpoch this means that we spend balance before and we need only write gaps
            balance.setGapsEpochCount(balance.getGapsEpochCount() + (currentEpoch - lastCommitedEpoch));
        } else if (maxPaidEpoch != 0 && currentEpoch > maxPaidEpoch && maxPaidEpoch > lastCommitedEpoch) {
            // if maxPaidEpoch does not equal 0, this means that maxPaidEpoch initialized before
            // currentEpoch > maxPaidEpoch && maxPaidEpoch > lastCommitedEpoch, this means that the deposit has run out and we need to write off the balance and write gaps
            // maxPaidEpoch > lastCommitedEpoch, this means that we didn't record it before

            uint256 amount = (maxPaidEpoch - lastCommitedEpoch) * pricePerWorkerEpoch_ * currentWorkerCount;

            balance.setTotalBalance(balance.getTotalBalance() - amount); // write off balance
            balance.setLockedBalance(balance.getLockedBalance() + amount); // record locked balance for rewards
            balance.setGapsEpochCount(balance.getGapsEpochCount() + (currentEpoch - maxPaidEpoch)); // write gaps
        } else if (maxPaidEpoch != 0 && currentEpoch <= maxPaidEpoch) {
            // if maxPaidEpoch does not equal 0, this means that maxPaidEpoch initialized before
            // currentEpoch <= maxPaidEpoch, this means that we we need to record only active epoches and write off balances. We don't have a gaps.
            uint256 amount = (currentEpoch - lastCommitedEpoch) * pricePerWorkerEpoch_ * currentWorkerCount;

            balance.setTotalBalance(balance.getTotalBalance() - amount); // write off balance
            balance.setLockedBalance(balance.getLockedBalance() + amount); // record locked balance for rewards
        }
    }

    function _postCommitPeriod(
        DealStorageUtils.Balance memory balance,
        uint256 currentEpoch,
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
            uint256 maxPaidEpoch =
                _calculateMaxPaidEpoch(currentEpoch, balance.getTotalBalance(), pricePerWorkerEpoch_, newWorkerCount);
            dealStorage.maxPaidEpoch = maxPaidEpoch;

            emit MaxPaidEpochUpdated(maxPaidEpoch);
        }

        balance.commitToStorage(dealStorage);
        dealStorage.lastCommitedEpoch = currentEpoch;
        dealStorage.maxPaidEpoch = currentEpoch;
    }

    // ------------------ Public View Functions ------------------
    function getStatus() public view returns (Status) {
        DealStorage storage dealStorage = _getDealStorage();

        if (dealStorage.isEnded) {
            return Status.ENDED;
        }

        if (getWorkerCount() < minWorkers()) {
            return Status.INACTIVE;
        } else if (_globalCore().currentEpoch() > dealStorage.maxPaidEpoch) {
            return Status.INACTIVE;
        } else {
            return Status.ACTIVE;
        }
    }

    function getFreeBalance() public view returns (uint256) {
        DealStorage storage dealStorage = _getDealStorage();

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(
            balance,
            _globalCore().currentEpoch(),
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

        uint256 currentEpoch = _globalCore().currentEpoch();
        uint256 workerCount = getWorkerCount();
        uint256 pricePerWorkerEpoch_ = pricePerWorkerEpoch();

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(
            balance,
            currentEpoch,
            dealStorage.maxPaidEpoch,
            dealStorage.lastCommitedEpoch,
            workerCount,
            pricePerWorkerEpoch_
        );

        uint256 reward = (
            (currentEpoch - computeUnitPaymentInfo.startedEpoch)
                - (balance.getGapsEpochCount() - computeUnitPaymentInfo.gapsDelta)
        ) * pricePerWorkerEpoch_;

        return reward;
    }

    function getMaxPaidEpoch() public view returns (uint256) {
        return _getDealStorage().maxPaidEpoch;
    }

    // ------------------ Public Mutable Functions ------------------
    function deposit(uint256 amount) external onlyOwner {
        DealStorage storage dealStorage = _getDealStorage();

        uint256 currentEpoch = _globalCore().currentEpoch();
        uint256 workerCount = getWorkerCount();
        uint256 pricePerWorkerEpoch_ = pricePerWorkerEpoch();

        uint256 maxPaidEpoch = dealStorage.maxPaidEpoch;

        require(getStatus() != Status.ENDED, "Deal is ended");

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(
            balance, currentEpoch, maxPaidEpoch, dealStorage.lastCommitedEpoch, workerCount, pricePerWorkerEpoch_
        );

        balance.setTotalBalance(balance.getTotalBalance() + amount);

        _postCommitPeriod(balance, currentEpoch, workerCount, workerCount, minWorkers(), pricePerWorkerEpoch_);

        paymentToken().safeTransferFrom(msg.sender, address(this), amount);

        emit Deposited(amount);
    }

    function withdraw(uint256 amount) external onlyOwner {
        DealStorage storage dealStorage = _getDealStorage();

        uint256 currentEpoch = _globalCore().currentEpoch();
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
                currentEpoch,
                dealStorage.maxPaidEpoch,
                dealStorage.lastCommitedEpoch,
                workerCount,
                pricePerWorkerEpoch_
            );

            balance.setTotalBalance(balance.getTotalBalance() - amount);

            uint256 minBalance = _globalCore().minDealDepositedEpoches() * pricePerWorkerEpoch_ * targetWorkers();
            require(balance.getTotalBalance() >= minBalance, "Free balance needs to cover minimum 2 epochs");

            _postCommitPeriod(balance, currentEpoch, workerCount, workerCount, minWorkers(), pricePerWorkerEpoch_);
        }

        paymentToken().safeTransfer(msg.sender, amount);

        emit Withdrawn(amount);
    }

    function withdrawRewards(bytes32 computeUnitId) external {
        DealStorage storage dealStorage = _getDealStorage();
        ComputeUnitPaymentInfo storage computeUnitPaymentInfo = dealStorage.cUnitPaymentInfo[computeUnitId];

        ComputeUnit memory unit = getComputeUnit(computeUnitId);
        IMarket market = _globalCore().market();
        IMarket.ComputePeer memory marketPeer = market.getComputePeer(unit.peerId);
        IMarket.Offer memory marketOffer = market.getOffer(marketPeer.offerId);

        require(
            marketPeer.owner == msg.sender || marketOffer.provider == msg.sender, "Only provider or owner can withdraw"
        );

        uint256 currentEpoch = _globalCore().currentEpoch();
        uint256 workerCount = getWorkerCount();
        uint256 pricePerWorkerEpoch_ = pricePerWorkerEpoch();

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(
            balance,
            currentEpoch,
            dealStorage.maxPaidEpoch,
            dealStorage.lastCommitedEpoch,
            workerCount,
            pricePerWorkerEpoch_
        );

        uint256 globalGapsEpochCount = balance.getGapsEpochCount();

        uint256 reward = (
            (currentEpoch - computeUnitPaymentInfo.startedEpoch)
                - (globalGapsEpochCount - computeUnitPaymentInfo.gapsDelta)
        ) * pricePerWorkerEpoch_;

        require(reward > 0, "No rewards");

        computeUnitPaymentInfo.startedEpoch = currentEpoch;
        computeUnitPaymentInfo.gapsDelta = globalGapsEpochCount;

        balance.setLockedBalance(balance.getLockedBalance() - reward);

        //TODO: fix double check prev state
        _postCommitPeriod(balance, currentEpoch, workerCount, workerCount, minWorkers(), pricePerWorkerEpoch_);

        paymentToken().safeTransfer(msg.sender, reward);

        emit RewardWithdrawn(computeUnitId, reward);
    }

    function addComputeUnit(address computeProvider, bytes32 computeUnitId, bytes32 peerId) public onlyMarket {
        require(getStatus() != Status.ENDED, "Deal is ended");

        _addComputeUnit(computeProvider, computeUnitId, peerId);
    }

    function removeComputeUnit(bytes32 computeUnitId) public onlyMarket {
        DealStorage storage dealStorage = _getDealStorage();

        uint256 currentEpoch = _globalCore().currentEpoch();
        //TODO: fix double get worker count
        uint256 prevWorkerCount = getWorkerCount();
        uint256 newWorkerCount = _removeComputeUnit(computeUnitId);
        uint256 pricePerWorkerEpoch_ = pricePerWorkerEpoch();
        uint256 maxPaidEpoch = _getDealStorage().maxPaidEpoch;

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(
            balance, currentEpoch, maxPaidEpoch, dealStorage.lastCommitedEpoch, prevWorkerCount, pricePerWorkerEpoch_
        );

        _postCommitPeriod(balance, currentEpoch, prevWorkerCount, newWorkerCount, minWorkers(), pricePerWorkerEpoch_);
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
        uint256 pricePerWorkerEpoch_ = pricePerWorkerEpoch();

        ComputeUnitPaymentInfo storage computeUnitPaymentInfo = dealStorage.cUnitPaymentInfo[computeUnitId];

        uint256 maxPaidEpoch = dealStorage.maxPaidEpoch;
        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(
            balance, currentEpoch, maxPaidEpoch, dealStorage.lastCommitedEpoch, prevWorkerCount, pricePerWorkerEpoch_
        );

        _postCommitPeriod(balance, currentEpoch, prevWorkerCount, newWorkerCounts, minWorkers(), pricePerWorkerEpoch_);

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
