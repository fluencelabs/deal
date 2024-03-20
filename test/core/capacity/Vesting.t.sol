// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "forge-std/console.sol";
import "forge-std/Vm.sol";
import "forge-std/StdCheats.sol";
import "src/core/modules/capacity/Vesting.sol";
import "test/utils/TestHelper.sol";
import "forge-std/StdCheats.sol";

contract VestingTest is Test {
    using Vesting for Vesting.Info;

    // ------------------ Variables ------------------
    Vesting.Info public vesting;

    // ------------------ Test ------------------
    function test_FirstAdd() public {
        uint256 reward = 100;
        uint256 startEpoch = 2;
        uint256 vestingPeriodDuration = 5;
        uint256 vestingPeriodCount = 5;

        vesting.add(reward, startEpoch, vestingPeriodDuration, vestingPeriodCount);
        assertEq(vesting.total(), reward);

        uint256 periodReward = reward / vestingPeriodCount;

        for (uint256 i = 1; i <= vestingPeriodCount; i++) {
            assertEq(vesting.unlocked(vestingPeriodDuration * i), periodReward * i);
        }
    }

    function test_AddDoubleInSameEpoch() public {
        uint256 reward = 100;
        uint256 startEpoch = 2;
        uint256 vestingPeriodDuration = 5;
        uint256 vestingPeriodCount = 5;

        vesting.add(reward, startEpoch, vestingPeriodDuration, vestingPeriodCount);
        vesting.add(reward, startEpoch, vestingPeriodDuration, vestingPeriodCount);

        uint256 totalReward = reward * 2;
        assertEq(vesting.total(), totalReward);

        uint256 periodReward = totalReward / vestingPeriodCount;
        for (uint256 i = 1; i <= vestingPeriodCount; i++) {
            assertEq(vesting.unlocked(vestingPeriodDuration * i), periodReward * i);
        }
    }

    function test_AddTwoInDifferentEpochs() public {
        uint256 reward = 100;
        uint256 startEpoch = 2;
        uint256 vestingPeriodDuration = 5;
        uint256 vestingPeriodCount = 5;

        vesting.add(reward, startEpoch, vestingPeriodDuration, vestingPeriodCount);

        uint256 nextReward = 250;
        uint256 nextEpoch = startEpoch + vestingPeriodDuration;
        vesting.add(nextReward, nextEpoch, vestingPeriodDuration, vestingPeriodCount);

        uint256 totalReward = reward + nextReward;
        assertEq(vesting.total(), totalReward, "totalReward mismatch");

        uint256 cummulativeReward = reward / vestingPeriodCount;
        assertEq(vesting.unlocked(vestingPeriodDuration), cummulativeReward, "unlocked 1 mismatch");
        for (uint256 i = 2; i < (vestingPeriodCount + 1); i++) {
            cummulativeReward += (reward + nextReward) / vestingPeriodCount;
            assertEq(vesting.unlocked(vestingPeriodDuration * i), cummulativeReward);
        }
        cummulativeReward += nextReward / vestingPeriodCount;
        assertEq(
            vesting.unlocked(vestingPeriodDuration * (vestingPeriodCount + 1)),
            cummulativeReward,
            "unlocked last mismatch"
        );
    }
}
