// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IDiamond} from "src/interfaces/IDiamond.sol";
import {ICore} from "src/core/interfaces/ICore.sol";
import {IDeal} from "src/deal/interfaces/IDeal.sol";
import {IDealWithPublicInternals} from "src/dev/test/interfaces/IDealWithPublicInternals.sol";

import {TestWithDeployment} from "test/utils/TestWithDeployment.sol";
import {TestHelper} from "test/utils/TestHelper.sol";


contract GetStatus is TestWithDeployment {
    using SafeERC20 for IERC20;
    using TestHelper for TestWithDeployment.Deployment;

    TestDiamond testDiamond;
    IDealWithPublicInternals dealContract;

    function setUp() public {
        testDiamond = new TestDiamond();
        dealContract =
            IDealWithPublicInternals(deployCode("out/DealWithPublicInternals.sol/DealWithPublicInternals.json"));
        dealContract.setDiamond(IDiamond(payable(address(testDiamond))));
    }

    function test_WhenEnded() public {
        testDiamond.setCurrentEpoch(101);
        dealContract.setEndedEpoch(101);
        assertEq(uint8(dealContract.getStatus()), uint8(IDeal.Status.ENDED), "Status mismatch");
    }
    function test_WhenWorkersCountIsNotMin() public {
        dealContract.setMinWorkers(10);
        dealContract.setWorkerCount(5);
        dealContract.setTargetWorkers(10);
        dealContract.setPricePerWorkerEpoch(1 ether);
        dealContract.setMaxPaidEpoch(0);
        testDiamond.setCurrentEpoch(101);
        dealContract.setLastCommitedEpoch(100);
        dealContract.setMaxPaidEpoch(0);
        uint256 minBalance =
            dealContract.targetWorkers() * testDiamond.minDealDepositedEpochs() * dealContract.pricePerWorkerEpoch();
        dealContract.setTotalBalance(minBalance);
        assertEq(uint8(dealContract.getStatus()), uint8(IDeal.Status.NOT_ENOUGH_WORKERS), "Status mismatch");
    }
    function test_WhenCurrentEpochMoreThenMaxPaid() public {
        dealContract.setMinWorkers(10);
        dealContract.setWorkerCount(10);
        dealContract.setPricePerWorkerEpoch(1 ether);
        testDiamond.setCurrentEpoch(101);
        dealContract.setMaxPaidEpoch(100);
        dealContract.setTargetWorkers(100);
        dealContract.setLastCommitedEpoch(100);
        assertEq(uint8(dealContract.getStatus()), uint8(IDeal.Status.INSUFFICIENT_FUNDS), "Status mismatch");
    }
    function test_WhenSmallBalance() public {
        dealContract.setMinWorkers(10);
        dealContract.setWorkerCount(10);
        dealContract.setPricePerWorkerEpoch(1 ether);
        testDiamond.setCurrentEpoch(101);
        dealContract.setMaxPaidEpoch(0);
        dealContract.setTargetWorkers(100);
        uint256 minBalance =
            dealContract.targetWorkers() * testDiamond.minDealDepositedEpochs() * dealContract.pricePerWorkerEpoch();
        dealContract.setTotalBalance(minBalance - 1);
        assertEq(uint8(dealContract.getStatus()), uint8(IDeal.Status.SMALL_BALANCE), "Status mismatch");
    }
    function test_WhenActive() public {
        dealContract.setMinWorkers(10);
        dealContract.setTargetWorkers(10);
        dealContract.setWorkerCount(10);
        dealContract.setPricePerWorkerEpoch(1 ether);
        testDiamond.setCurrentEpoch(100);
        dealContract.setLastCommitedEpoch(99);
        dealContract.setMaxPaidEpoch(100);
        uint256 minBalance =
            dealContract.targetWorkers() * testDiamond.minDealDepositedEpochs() * dealContract.pricePerWorkerEpoch();
        dealContract.setTotalBalance(minBalance);
        assertEq(uint8(dealContract.getStatus()), uint8(IDeal.Status.ACTIVE), "Status mismatc");
    }
}
contract TestDiamond {
    uint256 public currentEpoch;
    function setCurrentEpoch(uint256 epoch) public {
        currentEpoch = epoch;
    }
    function minDealDepositedEpochs() public pure returns (uint256) {
        return 2;
    }
}
