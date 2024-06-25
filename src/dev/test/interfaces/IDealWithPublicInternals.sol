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
import "src/deal/interfaces/IDeal.sol";
import "src/deal/DealSnapshot.sol";

interface IDealWithPublicInternals is IDeal {
    function setTotalBalance(uint256 totalBalance) external;
    function setLockedBalance(uint256 lockedBalance) external;
    function setGapsEpochCount(uint256 gapsEpochCount) external;
    function setEndedEpoch(uint256 endedEpoch) external;
    function setMaxPaidEpoch(uint256 maxPaidEpoch) external;
    function setLastCommitedEpoch(uint256 lastCommitedEpoch) external;
    function setPricePerWorkerEpoch(uint256 pricePerWorkerEpoch_) external;
    function setWorkerCount(uint256 workerCount_) external;
    function setMinWorkers(uint256 minWorkers_) external;
    function setTargetWorkers(uint256 targetWorkers_) external;
    function setCore(ICore core_) external;
    function preCommitPeriod() external view returns (DealSnapshot.Cache memory);
    function postCommitPeriod(DealSnapshot.Cache memory snapshot, uint256 newWorkerCount) external;
}
