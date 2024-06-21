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

import "./interfaces/ICapacity.sol";
library Snapshot {
    struct Cache {
        Params initial;
        Params current;
    }

    struct Params {
        ICapacity.CCStatus status;
        uint256 failedEpoch;
        uint256 remainingFailedUnitsInLastEpoch;
        uint256 totalFailCount;
        uint256 activeUnitCount;
        uint256 nextAdditionalActiveUnitCount;
        uint256 snapshotEpoch;
        uint256 currentSuccessCount;
    }
    
    function init(ICapacity.Commitment storage commitment) internal view returns (Cache memory cache) {
        cache.initial.status = commitment.info.status;
        cache.initial.failedEpoch = commitment.finish.failedEpoch;
        cache.initial.remainingFailedUnitsInLastEpoch = commitment.finish.remainingFailedUnitsInLastEpoch;
        cache.initial.totalFailCount = commitment.progress.totalFailCount;
        cache.initial.activeUnitCount = commitment.progress.activeUnitCount;
        cache.initial.nextAdditionalActiveUnitCount = commitment.progress.nextAdditionalActiveUnitCount;
        cache.initial.snapshotEpoch = commitment.progress.snapshotEpoch;
        cache.initial.currentSuccessCount = commitment.progress.currentSuccessCount;

        cache.current.status = cache.initial.status;
        cache.current.failedEpoch = cache.initial.failedEpoch;
        cache.current.remainingFailedUnitsInLastEpoch = cache.initial.remainingFailedUnitsInLastEpoch;
        cache.current.totalFailCount = cache.initial.totalFailCount;
        cache.current.activeUnitCount = cache.initial.activeUnitCount;
        cache.current.nextAdditionalActiveUnitCount = cache.initial.nextAdditionalActiveUnitCount;
        cache.current.snapshotEpoch = cache.initial.snapshotEpoch;
        cache.current.currentSuccessCount = cache.initial.currentSuccessCount;
    }
    
    function save(Cache memory self, ICapacity.Commitment storage commitment) internal {
        if (self.initial.status != self.current.status) {
            commitment.info.status = self.current.status;
        }
        if (self.initial.failedEpoch != self.current.failedEpoch) {
            commitment.finish.failedEpoch = self.current.failedEpoch;
        }
        if (self.initial.remainingFailedUnitsInLastEpoch != self.current.remainingFailedUnitsInLastEpoch) {
            commitment.finish.remainingFailedUnitsInLastEpoch = self.current.remainingFailedUnitsInLastEpoch;
        }
        if (self.initial.totalFailCount != self.current.totalFailCount) {
            commitment.progress.totalFailCount = self.current.totalFailCount;
        }
        if (self.initial.activeUnitCount != self.current.activeUnitCount) {
            commitment.progress.activeUnitCount = self.current.activeUnitCount;
        }
        if (self.initial.nextAdditionalActiveUnitCount != self.current.nextAdditionalActiveUnitCount) {
            commitment.progress.nextAdditionalActiveUnitCount = self.current.nextAdditionalActiveUnitCount;
        }
        if (self.initial.snapshotEpoch != self.current.snapshotEpoch) {
            commitment.progress.snapshotEpoch = self.current.snapshotEpoch;
        }
        if (self.initial.currentSuccessCount != self.current.currentSuccessCount) {
            commitment.progress.currentSuccessCount = self.current.currentSuccessCount;
        }
    }
}
