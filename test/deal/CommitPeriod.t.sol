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

import {Test} from "forge-std/Test.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "src/deal/interfaces/IDeal.sol";
import "src/deal/DealSnapshot.sol";
import "src/dev/test/interfaces/IDealWithPublicInternals.sol";

import "test/utils/TestWithDeployment.sol";
import "test/utils/TestHelper.sol";

contract CommitPeriod is TestWithDeployment {
    using SafeERC20 for IERC20;
    using TestHelper for TestWithDeployment.Deployment;
    using DealSnapshot for DealSnapshot.Cache;

    IDealWithPublicInternals dealContract;

    // ------------------ Test ------------------
    function setUp() public {
        _deploySystem();
        dealContract = IDealWithPublicInternals(deployCode("out/DealWithPublicInternals.sol/DealWithPublicInternals.json"));
    }

    function test_RecordGaps() public {
        dealContract.setTotalBalance(100 ether);
        dealContract.setLockedBalance(0);

        uint256 gapsEpochCount = 50;
        dealContract.setGapsEpochCount(gapsEpochCount);

        uint256 lastCommitedEpoch = 50;
        dealContract.setMaxPaidEpoch(lastCommitedEpoch);
        dealContract.setLastCommitedEpoch(lastCommitedEpoch);

        dealContract.setPricePerWorkerEpoch(1 ether);
        dealContract.setWorkerCount(1);

        uint256 currentEpoch = 101;
        _mockCurrentEpoch(currentEpoch);

        DealSnapshot.Cache memory snapshot = dealContract.preCommitPeriod();

        assertEq(snapshot.getTotalBalance(), 100 ether, "totalBalance mismatch");
        assertEq(snapshot.getLockedBalance(), 0, "lockedBalance mismatch");
        assertEq(
            snapshot.getGapsEpochCount(),
            gapsEpochCount + (currentEpoch - 1) - lastCommitedEpoch,
            "gapsEpochCount mismatch"
        );
    }

    function test_WriteOffBalanceAndRecordGaps() public {
        dealContract.setLockedBalance(0);

        uint256 gapsEpochCount = 100;
        dealContract.setGapsEpochCount(gapsEpochCount);

        uint256 lastCommitedEpoch = gapsEpochCount;
        dealContract.setLastCommitedEpoch(lastCommitedEpoch);

        uint256 maxPaidEpoch = 150;
        dealContract.setMaxPaidEpoch(maxPaidEpoch);

        dealContract.setPricePerWorkerEpoch(200 ether);
        dealContract.setWorkerCount(5);

        uint256 totalBalance = (dealContract.getMaxPaidEpoch() - lastCommitedEpoch) * dealContract.pricePerWorkerEpoch()
            * dealContract.getWorkerCount();
        dealContract.setTotalBalance(totalBalance);

        uint256 currentEpoch = 201;
        _mockCurrentEpoch(currentEpoch);

        DealSnapshot.Cache memory snapshot = dealContract.preCommitPeriod();

        assertEq(snapshot.getTotalBalance(), 0, "totalBalance mismatch");
        assertEq(snapshot.getLockedBalance(), totalBalance, "lockedBalance mismatch");
        assertEq(
            snapshot.getGapsEpochCount(), gapsEpochCount + (currentEpoch - 1) - maxPaidEpoch, "gapsEpochCount mismatch"
        );
    }

    function test_WriteOffBalanceWithoutGaps() public {
        dealContract.setLockedBalance(0);

        uint256 gapsEpochCount = 100;
        dealContract.setGapsEpochCount(gapsEpochCount);

        uint256 lastCommitedEpoch = gapsEpochCount;
        dealContract.setLastCommitedEpoch(lastCommitedEpoch);

        uint256 currentEpoch = 201;
        uint256 maxPaidEpoch = currentEpoch - 1;
        dealContract.setMaxPaidEpoch(maxPaidEpoch);

        dealContract.setPricePerWorkerEpoch(200 ether);
        dealContract.setWorkerCount(5);

        uint256 totalBalance =
            (currentEpoch - 1 - lastCommitedEpoch) * dealContract.pricePerWorkerEpoch() * dealContract.getWorkerCount();
        dealContract.setTotalBalance(totalBalance);

        _mockCurrentEpoch(currentEpoch);

        DealSnapshot.Cache memory snapshot = dealContract.preCommitPeriod();

        assertEq(snapshot.getTotalBalance(), 0, "totalBalance mismatch");
        assertEq(snapshot.getLockedBalance(), totalBalance, "lockedBalance mismatch");
        assertEq(snapshot.getGapsEpochCount(), gapsEpochCount, "gapsEpochCount mismatch");
    }

    // ------------------ Internal ------------------
    function _mockCurrentEpoch(uint256 currentEpoch) internal {
        vm.mockCall(
            address(0x00), abi.encodeWithSelector(IEpochController.currentEpoch.selector), abi.encode(currentEpoch)
        );
    }
}
