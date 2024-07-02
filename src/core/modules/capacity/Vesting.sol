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

        // find next epoch divisible by vestingPeriodDuration
        uint256 startVestingEpoch = (startEpoch + (vestingPeriodDuration - startEpoch % vestingPeriodDuration));
        int256 index = _findClosest(self, startVestingEpoch);

        // if startVestingEpoch is lower than all epochs in self.items, then it will be added to the back of the array,
        // making self.items[i] non-monotonous
        if (index == -1 && length != 0) {
            revert("Vesting: startEpoch is below than all seen epochs");
        }

        uint256 prevCumulativeAmount = 0;
        // if startVestingEpoch is larger than any epoch in items, we need to skip this item
        if (index >= 0 && self.items[uint256(index)].epoch < startVestingEpoch) {
            prevCumulativeAmount = self.items[uint256(index)].cumulativeAmount;
            index++;
        }

        for (uint256 i = 0; i < vestingPeriodCount; i++) {
            // add reward to cumulativeAmount
            if (index >= 0 && index < int256(length)) {
                Item storage item = self.items[uint256(index)];
                prevCumulativeAmount = item.cumulativeAmount; // Do NOT add rewardPerPeriod * (i + 1) here, it will break logic
                item.cumulativeAmount = prevCumulativeAmount + rewardPerPeriod * (i + 1);
                index++;
            } else {
                self.items.push(
                    Item({
                        epoch: startVestingEpoch + (vestingPeriodDuration * i),
                        cumulativeAmount: prevCumulativeAmount + rewardPerPeriod * (i + 1)
                    })
                );
            }
        }
    }

    // Returns:
    // if exists, highest index such that self.items[index].epoch <= withdrawEpoch
    // -1 otherwise
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
