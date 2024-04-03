// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "./interfaces/IDeal.sol";

library DealSnapshot {
    // ------------------ TYPES ------------------
    struct Cache {
        uint256 _initTotalBalance;
        uint256 _initLockedBalance;
        uint256 _initGapsEpochCount;
        uint256 _totalBalance;
        uint256 _lockedBalance;
        uint256 _gapsEpochCount;
        uint256 _currentEpoch;
        uint256 _snapshotEpoch;
        bool _isEnded;
        uint256 _pricePerWorkerEpoch;
        uint256 _currentWorkerCount;
    }

    // ------------------ VIEWS ------------------
    function getTotalBalance(Cache memory self) internal pure returns (uint256) {
        return self._totalBalance;
    }

    function getLockedBalance(Cache memory self) internal pure returns (uint256) {
        return self._lockedBalance;
    }

    function getGapsEpochCount(Cache memory self) internal pure returns (uint256) {
        return self._gapsEpochCount;
    }

    function getCurrentEpoch(Cache memory self) internal pure returns (uint256) {
        return self._currentEpoch;
    }

    function getSnapshotEpoch(Cache memory self) internal pure returns (uint256) {
        return self._snapshotEpoch;
    }

    function isEnded(Cache memory self) internal pure returns (bool) {
        return self._isEnded;
    }

    function getPricePerWorkerEpoch(Cache memory self) internal pure returns (uint256) {
        return self._pricePerWorkerEpoch;
    }

    function getCurrentWorkerCount(Cache memory self) internal pure returns (uint256) {
        return self._currentWorkerCount;
    }

    // ------------------ MUTABLES ------------------
    function init(
        IDeal.DealStorage storage dealStorage,
        uint256 currentEpoch,
        uint256 snapshotEpoch,
        bool isEnded_,
        uint256 pricePerWorkerEpoch_,
        uint256 currentWorkerCount
    ) internal view returns (Cache memory) {
        uint256 totalBalance = dealStorage.totalBalance;
        uint256 lockedBalance = dealStorage.lockedBalance;
        uint256 gapsEpochCount = dealStorage.gapsEpochCount;

        return Cache({
            _initTotalBalance: totalBalance,
            _initLockedBalance: lockedBalance,
            _initGapsEpochCount: gapsEpochCount,
            _totalBalance: totalBalance,
            _lockedBalance: lockedBalance,
            _gapsEpochCount: gapsEpochCount,
            _currentEpoch: currentEpoch,
            _snapshotEpoch: snapshotEpoch,
            _isEnded: isEnded_,
            _pricePerWorkerEpoch: pricePerWorkerEpoch_,
            _currentWorkerCount: currentWorkerCount
        });
    }

    function setTotalBalance(Cache memory self, uint256 totalBalance) internal pure {
        self._totalBalance = totalBalance;
    }

    function setLockedBalance(Cache memory self, uint256 lockedBalance) internal pure {
        self._lockedBalance = lockedBalance;
    }

    function setGapsEpochCount(Cache memory self, uint256 gapsEpochCount) internal pure {
        self._gapsEpochCount = gapsEpochCount;
    }

    function commitToStorage(Cache memory self, IDeal.DealStorage storage dealStorage) internal {
        if (self._initTotalBalance != self._totalBalance) {
            dealStorage.totalBalance = self._totalBalance;
        }

        if (self._initLockedBalance != self._lockedBalance) {
            dealStorage.lockedBalance = self._lockedBalance;
        }

        if (self._initGapsEpochCount != self._gapsEpochCount) {
            dealStorage.gapsEpochCount = self._gapsEpochCount;
        }
    }
}
