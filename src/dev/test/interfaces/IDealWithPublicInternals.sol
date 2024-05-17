// SPDX-License-Identifier: Apache-2.0
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
