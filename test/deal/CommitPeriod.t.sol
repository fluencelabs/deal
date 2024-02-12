// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "forge-std/console.sol";
import "src/deal/Deal.sol";
import "src/deal/interfaces/IConfig.sol";
import "src/core/modules/market/Offer.sol";
import "test/utils/DeployDealSystem.sol";
import "test/utils/TestHelper.sol";
import "src/deal/DealStorageUtils.sol";

contract CommitPeriod is Test {
    using SafeERC20 for IERC20;
    using TestHelper for DeployDealSystem.Deployment;
    using DealStorageUtils for DealStorageUtils.Balance;

    DeployDealSystem.Deployment deployment;
    TestDealContract dealContract;
    Deal.DealStorage dealStorage;

    // ------------------ Test ------------------
    /*
        


        if (maxPaidEpoch == 0 || (currentEpoch > maxPaidEpoch && lastCommitedEpoch >= maxPaidEpoch)) 
        мы должны засетапить гепы так как если

      if (maxPaidEpoch != 0 && currentEpoch > maxPaidEpoch && maxPaidEpoch > lastCommitedEpoch) {
            uint256 amount = (maxPaidEpoch - lastCommitedEpoch) * pricePerWorkerEpoch_ * currentWorkerCount;

            balance.setTotalBalance(balance.getTotalBalance() - amount);
            balance.setLockedBalance(balance.getLockedBalance() + amount);
            balance.setGapsEpochCount(balance.getGapsEpochCount() + (currentEpoch - maxPaidEpoch));
        } else if (maxPaidEpoch == 0 || (currentEpoch > maxPaidEpoch && lastCommitedEpoch >= maxPaidEpoch)) {
            balance.setGapsEpochCount(balance.getGapsEpochCount() + (currentEpoch - lastCommitedEpoch));
        } else if (maxPaidEpoch != 0 && currentEpoch <= maxPaidEpoch) {
            uint256 amount = (currentEpoch - lastCommitedEpoch) * pricePerWorkerEpoch_ * currentWorkerCount;

            balance.setTotalBalance(balance.getTotalBalance() - amount);
            balance.setLockedBalance(balance.getLockedBalance() + amount);
        }
    */

    function setUp() public {
        deployment = DeployDealSystem.deployDealSystem();
        dealContract = new TestDealContract();
        dealStorage.totalBalance = 0;
        dealStorage.lockedBalance = 0;
        dealStorage.gapsEpochCount = 0;
    }

    function test_RecordGapsWhenMaxPaidEpochIsZero() public {
        dealStorage.totalBalance = 100 ether;
        dealStorage.lockedBalance = 0 ether;
        dealStorage.gapsEpochCount = 0;

        uint256 currentEpoch = 100;
        uint256 maxPaidEpoch = 0;
        uint256 lastCommitedEpoch = 0;
        uint256 pricePerWorkerEpoch = 1 ether;
        uint256 currentWorkerCount = 1;

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        dealContract.preCommitPeriod(
            balance, currentEpoch, maxPaidEpoch, lastCommitedEpoch, currentWorkerCount, pricePerWorkerEpoch
        );

        assertEq(balance.getTotalBalance(), 100 ether, "totalBalance mismatch");
        assertEq(balance.getLockedBalance(), 0, "lockedBalance mismatch");
        assertEq(balance.getGapsEpochCount(), 100, "gapsEpochCount mismatch");
    }

    function test_RecordGapsWhenDealIsInactive() public {}

    function test_WrtieOffBalanceWithoutGaps() public {
        dealStorage.lockedBalance = 0 ether;
        dealStorage.gapsEpochCount = 100;

        uint256 lastCommitedEpoch = dealStorage.gapsEpochCount;
        uint256 currentEpoch = 200;
        uint256 maxPaidEpoch = currentEpoch;
        uint256 pricePerWorkerEpoch = 200 ether;
        uint256 currentWorkerCount = 5;

        dealStorage.totalBalance = (currentEpoch - lastCommitedEpoch) * pricePerWorkerEpoch * currentWorkerCount;

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        dealContract.preCommitPeriod(
            balance, currentEpoch, maxPaidEpoch, lastCommitedEpoch, currentWorkerCount, pricePerWorkerEpoch
        );

        assertEq(balance.getTotalBalance(), 0, "totalBalance mismatch");
        assertEq(balance.getLockedBalance(), dealStorage.totalBalance, "lockedBalance mismatch");
        assertEq(balance.getGapsEpochCount(), dealStorage.gapsEpochCount, "gapsEpochCount mismatch");
    }

    function test_WrtieOffBalanceAndRecordGaps() public {}
}

contract TestDealContract is Deal {
    function preCommitPeriod(
        DealStorageUtils.Balance memory balance,
        uint256 currentEpoch,
        uint256 maxPaidEpoch,
        uint256 lastCommitedEpoch,
        uint256 currentWorkerCount,
        uint256 pricePerWorkerEpoch_
    ) public pure {
        _preCommitPeriod(
            balance, currentEpoch, maxPaidEpoch, lastCommitedEpoch, currentWorkerCount, pricePerWorkerEpoch_
        );
    }

    function postCommitPeriod(
        DealStorageUtils.Balance memory balance,
        uint256 currentEpoch,
        uint256 prevWorkerCount,
        uint256 newWorkerCount,
        uint256 minWorkerCount,
        uint256 pricePerWorkerEpoch_
    ) public {
        _postCommitPeriod(balance, currentEpoch, prevWorkerCount, newWorkerCount, minWorkerCount, pricePerWorkerEpoch_);
    }
}
