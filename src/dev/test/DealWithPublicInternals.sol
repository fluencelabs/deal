// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "src/core/interfaces/ICore.sol";
import "src/deal/Deal.sol";
import "src/deal/DealSnapshot.sol";
import "./interfaces/IDealWithPublicInternals.sol";

contract DealWithPublicInternals is IDealWithPublicInternals, Deal {
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.deal.storage.v1")) - 1);
    bytes32 private constant _WORKER_STORAGE_SLOT =
        bytes32(uint256(keccak256("fluence.deal.storage.v1.workerManager")) - 1);
    bytes32 private constant _CONFIG_STORAGE_SLOT = bytes32(uint256(keccak256("fluence.deal.storage.v1.config")) - 1);

    function _getConfigStorageTest() private pure returns (ConfigStorage storage s) {
        bytes32 storageSlot = _CONFIG_STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    function _getWorkerManagerStorageTest() private pure returns (WorkerManagerStorage storage s) {
        bytes32 storageSlot = _WORKER_STORAGE_SLOT;

        assembly {
            s.slot := storageSlot
        }
    }

    function _getStorage() private pure returns (DealStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    function setTotalBalance(uint256 totalBalance) public {
        _getStorage().totalBalance = totalBalance;
    }

    function setLockedBalance(uint256 lockedBalance) public {
        _getStorage().lockedBalance = lockedBalance;
    }

    function setGapsEpochCount(uint256 gapsEpochCount) public {
        _getStorage().gapsEpochCount = gapsEpochCount;
    }

    function setEndedEpoch(uint256 endedEpoch) public {
        _getStorage().endedEpoch = endedEpoch;
    }

    function setMaxPaidEpoch(uint256 maxPaidEpoch) public {
        _getStorage().maxPaidEpoch = maxPaidEpoch;
    }

    function setLastCommitedEpoch(uint256 lastCommitedEpoch) public {
        _getStorage().lastCommitedEpoch = lastCommitedEpoch;
    }

    function setPricePerWorkerEpoch(uint256 pricePerWorkerEpoch_) public {
        _getConfigStorageTest().pricePerWorkerEpoch = pricePerWorkerEpoch_;
    }

    function setWorkerCount(uint256 workerCount_) public {
        _getWorkerManagerStorageTest().workerCount = workerCount_;
    }

    function setMinWorkers(uint256 minWorkers_) public {
        _getConfigStorageTest().minWorkers = minWorkers_;
    }

    function setDiamond(IDiamond diamond_) public {
        _getConfigStorageTest().diamond = diamond_;
    }

    function setTargetWorkers(uint256 targetWorkers_) public {
        _getConfigStorageTest().targetWorkers = targetWorkers_;
    }

    function preCommitPeriod() public view returns (DealSnapshot.Cache memory) {
        return _preCommitPeriod();
    }

    function postCommitPeriod(DealSnapshot.Cache memory snapshot, uint256 newWorkerCount) public {
        _postCommitPeriod(snapshot, newWorkerCount);
    }
}
