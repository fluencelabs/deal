// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

library Vesting {
    struct Info {
        uint256 totalWithdrawnReward;
        Item[] items;
    }

    struct Item {
        uint256 epoch;
        uint256 cumulativeAmount;
    }

    function total(Info storage self) internal view returns (uint256) {
        uint256 length = self.items.length;
        if (length == 0) {
            return 0;
        }

        return self.items[length - 1].cumulativeAmount - self.totalWithdrawnReward;
    }

    function unlocked(Info storage self, uint256 withdrawEpoch) internal view returns (uint256) {
        int256 index = _findClosest(self, withdrawEpoch);
        if (index < 0) {
            return 0;
        }

        return self.items[uint256(index)].cumulativeAmount - self.totalWithdrawnReward;
    }

    function withdraw(Info storage self, uint256 withdrawEpoch) internal returns (uint256 withdrawAmount) {
        // mv find closest min vesting to offchain
        (int256 index) = _findClosest(self, withdrawEpoch);
        require(index >= 0, "Nothing to withdraw");

        Item storage item = self.items[uint256(index)];
        uint256 totalWithdrawnReward = self.totalWithdrawnReward;

        withdrawAmount = item.cumulativeAmount - totalWithdrawnReward;
        self.totalWithdrawnReward = totalWithdrawnReward + withdrawAmount;
    }

    function add(
        Info storage self,
        uint256 reward,
        uint256 startEpoch,
        uint256 vestingPeriodDuration,
        uint256 vestingPeriodCount
    ) internal {
        uint256 length = self.items.length;
        uint256 rewardPerPeriod = reward / vestingPeriodCount;
        uint256 startVestingEpoch = (startEpoch + (vestingPeriodDuration - startEpoch % vestingPeriodDuration));

        int256 index = _findClosest(self, startVestingEpoch);
        uint256 cumulativeAmount = 0;

        for (uint256 i = 0; i < vestingPeriodCount; i++) {
            cumulativeAmount += rewardPerPeriod;
            if (index >= 0 && index < int256(length)) {
                Item storage item = self.items[uint256(index)];
                item.cumulativeAmount += item.cumulativeAmount;
                item.cumulativeAmount = cumulativeAmount;
                index++;
            } else {
                uint256 vestingEpoch = startVestingEpoch + (vestingPeriodDuration * i);
                self.items.push(Item({epoch: vestingEpoch, cumulativeAmount: cumulativeAmount}));
            }
        }
    }

    function _findClosest(Info storage self, uint256 withdrawEpoch) private view returns (int256 index) {
        uint256 length = self.items.length;
        index = -1;

        if (length == 0) {
            return index;
        }

        uint256 low = 0;
        uint256 high = length - 1;

        while (low <= high) {
            uint256 mid = (low + high) / 2;

            Item storage item = self.items[mid];
            uint256 itemEpoch = item.epoch;

            if (withdrawEpoch > itemEpoch) {
                index = int256(mid);
                low = mid + 1;
            } else if (withdrawEpoch < itemEpoch) {
                if (mid == 0) {
                    return -1;
                } else {
                    high = mid - 1;
                }
            } else {
                return int256(mid);
            }
        }
    }
}
