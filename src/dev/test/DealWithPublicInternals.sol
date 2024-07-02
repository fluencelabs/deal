/*
 * Fluence Compute Marketplace
 *
 * Copyright (C) 2024 Fluence DAO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation version 3 of the
 * License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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

    function setCore(ICore core_) public {
        _getConfigStorageTest().globalCore = core_;
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
