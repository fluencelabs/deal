// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "src/deal/Deal.sol";
import "src/deal/DealSnapshot.sol";

import "test/utils/DeployDealSystem.sol";
import "test/utils/TestHelper.sol";

contract CommitPeriod is Test {
    using SafeERC20 for IERC20;
    using TestHelper for DeployDealSystem.Deployment;
    using DealSnapshot for DealSnapshot.Cache;

    DeployDealSystem.Deployment deployment;
    TestDealContract dealContract;

    // ------------------ Test ------------------
    function setUp() public {
        deployment = DeployDealSystem.deployDealSystem();
        dealContract = new TestDealContract();
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

    function test_WrtieOffBalanceAndRecordGaps() public {
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

    function test_WrtieOffBalanceWithoutGaps() public {
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

contract TestDealContract is Deal {
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.deal.storage.v1")) - 1);
    bytes32 private constant _WORKER_STORAGE_SLOT =
        bytes32(uint256(keccak256("fluence.deal.storage.v1.workerManager")) - 1);
    bytes32 private constant _CONFIG_STORAGE_SLOT = bytes32(uint256(keccak256("fluence.deal.storage.v1.config")) - 1);

    function _getConfigStorageTest() private pure returns (ConfigStorage storage s) {
        bytes32 storageSlot = _CONFIG_STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    function _getWorkerManagerStorageTest() private pure returns (WorkerManagerStorage storage s) {
        bytes32 storageSlot = _WORKER_STORAGE_SLOT;

        assembly {
            s.slot := storageSlot
        }
    }

    function _getStorage() private pure returns (DealStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    function setTotalBalance(uint256 totalBalance) public {
        _getStorage().totalBalance = totalBalance;
    }

    function setLockedBalance(uint256 lockedBalance) public {
        _getStorage().lockedBalance = lockedBalance;
    }

    function setGapsEpochCount(uint256 gapsEpochCount) public {
        _getStorage().gapsEpochCount = gapsEpochCount;
    }

    function setEndedEpoch(uint256 endedEpoch) public {
        _getStorage().endedEpoch = endedEpoch;
    }

    function setMaxPaidEpoch(uint256 maxPaidEpoch) public {
        _getStorage().maxPaidEpoch = maxPaidEpoch;
    }

    function setLastCommitedEpoch(uint256 lastCommitedEpoch) public {
        _getStorage().lastCommitedEpoch = lastCommitedEpoch;
    }

    function setPricePerWorkerEpoch(uint256 pricePerWorkerEpoch_) public {
        _getConfigStorageTest().pricePerWorkerEpoch = pricePerWorkerEpoch_;
    }

    function setWorkerCount(uint256 workerCount_) public {
        _getWorkerManagerStorageTest().workerCount = workerCount_;
    }

    function setMinWorkers(uint256 minWorkers_) public {
        _getConfigStorageTest().minWorkers = minWorkers_;
    }

    function setTargetWorkers(uint256 targetWorkers_) public {
        _getConfigStorageTest().targetWorkers = targetWorkers_;
    }

    function preCommitPeriod() public view returns (DealSnapshot.Cache memory) {
        return _preCommitPeriod();
    }

    function postCommitPeriod(DealSnapshot.Cache memory snapshot, uint256 newWorkerCount) public {
        _postCommitPeriod(snapshot, newWorkerCount);
    }
}
