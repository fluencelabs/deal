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
    function setUp() public {
        deployment = DeployDealSystem.deployDealSystem();
        dealContract = new TestDealContract();
    }

    function test_RecordGaps() public {
        dealStorage.totalBalance = 100 ether;
        dealStorage.lockedBalance = 0 ether;
        dealStorage.gapsEpochCount = 50;

        uint256 prevEpoch = 100;
        uint256 maxPaidEpoch = 50;
        uint256 lastCommitedEpoch = 50;
        uint256 pricePerWorkerEpoch = 1 ether;
        uint256 currentWorkerCount = 1;

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        balance = dealContract.preCommitPeriod(
            balance, prevEpoch, maxPaidEpoch, lastCommitedEpoch, currentWorkerCount, pricePerWorkerEpoch
        );

        assertEq(balance.getTotalBalance(), 100 ether, "totalBalance mismatch");
        assertEq(balance.getLockedBalance(), 0, "lockedBalance mismatch");
        assertEq(
            balance.getGapsEpochCount(),
            dealStorage.gapsEpochCount + prevEpoch - lastCommitedEpoch,
            "gapsEpochCount mismatch"
        );
    }

    function test_WrtieOffBalanceAndRecordGaps() public {
        dealStorage.lockedBalance = 0 ether;
        dealStorage.gapsEpochCount = 100;

        uint256 lastCommitedEpoch = dealStorage.gapsEpochCount;
        uint256 prevEpoch = 200;
        uint256 maxPaidEpoch = 150;
        uint256 pricePerWorkerEpoch = 200 ether;
        uint256 currentWorkerCount = 5;

        dealStorage.totalBalance = (maxPaidEpoch - lastCommitedEpoch) * pricePerWorkerEpoch * currentWorkerCount;

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        balance = dealContract.preCommitPeriod(
            balance, prevEpoch, maxPaidEpoch, lastCommitedEpoch, currentWorkerCount, pricePerWorkerEpoch
        );

        assertEq(balance.getTotalBalance(), 0, "totalBalance mismatch");
        assertEq(balance.getLockedBalance(), dealStorage.totalBalance, "lockedBalance mismatch");
        assertEq(
            balance.getGapsEpochCount(),
            dealStorage.gapsEpochCount + prevEpoch - maxPaidEpoch,
            "gapsEpochCount mismatch"
        );
    }

    function test_WrtieOffBalanceWithoutGaps() public {
        dealStorage.lockedBalance = 0 ether;
        dealStorage.gapsEpochCount = 100;

        uint256 lastCommitedEpoch = dealStorage.gapsEpochCount;
        uint256 prevEpoch = 200;
        uint256 maxPaidEpoch = prevEpoch;
        uint256 pricePerWorkerEpoch = 200 ether;
        uint256 currentWorkerCount = 5;

        dealStorage.totalBalance = (prevEpoch - lastCommitedEpoch) * pricePerWorkerEpoch * currentWorkerCount;

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        balance = dealContract.preCommitPeriod(
            balance, prevEpoch, maxPaidEpoch, lastCommitedEpoch, currentWorkerCount, pricePerWorkerEpoch
        );

        assertEq(balance.getTotalBalance(), 0, "totalBalance mismatch");
        assertEq(balance.getLockedBalance(), dealStorage.totalBalance, "lockedBalance mismatch");
        assertEq(balance.getGapsEpochCount(), dealStorage.gapsEpochCount, "gapsEpochCount mismatch");
    }
}

contract TestDealContract is Deal {
    function preCommitPeriod(
        DealStorageUtils.Balance memory balance,
        uint256 currentEpoch,
        uint256 maxPaidEpoch,
        uint256 lastCommitedEpoch,
        uint256 currentWorkerCount,
        uint256 pricePerWorkerEpoch_
    ) public view returns (DealStorageUtils.Balance memory) {
        _preCommitPeriod(
            balance, currentEpoch, maxPaidEpoch, lastCommitedEpoch, currentWorkerCount, pricePerWorkerEpoch_
        );

        return balance;
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
