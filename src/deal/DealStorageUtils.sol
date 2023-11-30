// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "./Deal.sol";

library DealStorageUtils {
    // ------------------ TYPES ------------------
    struct Balance {
        uint256 _initTotalBalance;
        uint256 _initLockedBalance;
        uint256 _initGapsEpochCount;
        uint256 _totalBalance;
        uint256 _lockedBalance;
        uint256 _gapsEpochCount;
    }

    // ------------------ VIEWS ------------------
    function getTotalBalance(Balance memory self) internal pure returns (uint256) {
        return self._totalBalance;
    }

    function getLockedBalance(Balance memory self) internal pure returns (uint256) {
        return self._lockedBalance;
    }

    function getGapsEpochCount(Balance memory self) internal pure returns (uint256) {
        return self._gapsEpochCount;
    }

    // ------------------ MUTABLES ------------------
    function initCache(Deal.DealStorage storage dealStorage) internal view returns (Balance memory) {
        uint256 totalBalance = dealStorage.totalBalance;
        uint256 lockedBalance = dealStorage.lockedBalance;
        uint256 gapsEpochCount = dealStorage.gapsEpochCount;

        return Balance({
            _initTotalBalance: totalBalance,
            _initLockedBalance: lockedBalance,
            _initGapsEpochCount: gapsEpochCount,
            _totalBalance: totalBalance,
            _lockedBalance: lockedBalance,
            _gapsEpochCount: gapsEpochCount
        });
    }

    function setTotalBalance(Balance memory self, uint256 totalBalance) internal pure {
        self._totalBalance = totalBalance;
    }

    function setLockedBalance(Balance memory self, uint256 lockedBalance) internal pure {
        self._lockedBalance = lockedBalance;
    }

    function setGapsEpochCount(Balance memory self, uint256 gapsEpochCount) internal pure {
        self._gapsEpochCount = gapsEpochCount;
    }

    function commitToStorage(Balance memory self, Deal.DealStorage storage dealStorage) internal {
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
