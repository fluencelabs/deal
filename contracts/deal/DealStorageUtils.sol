// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "./Deal.sol";

library DealStorageUtils {
    // ------------------ TYPES ------------------
    struct Balance {
        uint _initTotalBalance;
        uint _initLockedBalance;
        uint _initGapsEpochCount;
        uint _totalBalance;
        uint _lockedBalance;
        uint _gapsEpochCount;
    }

    // ------------------ VIEWS ------------------
    function getTotalBalance(Balance memory self) internal pure returns (uint) {
        return self._totalBalance;
    }

    function getLockedBalance(Balance memory self) internal pure returns (uint) {
        return self._lockedBalance;
    }

    function getGapsEpochCount(Balance memory self) internal pure returns (uint) {
        return self._gapsEpochCount;
    }

    // ------------------ MUTABLES ------------------
    function initCache(Deal.DealStorage storage dealStorage) internal view returns (Balance memory) {
        uint totalBalance = dealStorage.totalBalance;
        uint lockedBalance = dealStorage.lockedBalance;
        uint gapsEpochCount = dealStorage.gapsEpochCount;

        return
            Balance({
                _initTotalBalance: totalBalance,
                _initLockedBalance: lockedBalance,
                _initGapsEpochCount: gapsEpochCount,
                _totalBalance: totalBalance,
                _lockedBalance: lockedBalance,
                _gapsEpochCount: gapsEpochCount
            });
    }

    function setTotalBalance(Balance memory self, uint totalBalance) internal pure {
        self._totalBalance = totalBalance;
    }

    function setLockedBalance(Balance memory self, uint lockedBalance) internal pure {
        self._lockedBalance = lockedBalance;
    }

    function setGapsEpochCount(Balance memory self, uint gapsEpochCount) internal pure {
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
