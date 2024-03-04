// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "forge-std/console.sol";
import "src/deal/Deal.sol";
import "src/deal/interfaces/IDeal.sol";
import "src/deal/interfaces/IConfig.sol";
import "src/core/modules/market/Offer.sol";
import "test/utils/DeployDealSystem.sol";
import "test/utils/TestHelper.sol";
import "src/deal/DealStorageUtils.sol";

contract GetStatus is Test {
    using SafeERC20 for IERC20;
    using TestHelper for DeployDealSystem.Deployment;
    using DealStorageUtils for DealStorageUtils.Balance;

    DeployDealSystem.Deployment deployment;
    TestCore testCore;
    TestDealContract dealContract;
    Deal.DealStorage dealStorage;

    // ------------------ Test ------------------
    function setUp() public {
        testCore = new TestCore();
        dealContract = new TestDealContract();
        dealContract.setCore(address(testCore));
    }

    function test_WhenEnded() public {
        dealContract.setIsEnded(true);
        assertEq(uint8(dealContract.getStatus()), uint8(IDeal.Status.ENDED), "Status mismatc");
    }

    function test_WhenWorkersCountIsNotMin() public {
        dealContract.setMinWorkers(10);
        dealContract.setWorkerCount(5);
        dealContract.setMaxPaidEpoch(100);

        assertEq(uint8(dealContract.getStatus()), uint8(IDeal.Status.NOT_ENOUGH_WORKERS), "Status mismatc");
    }

    function test_WhenCurrentEpochMoreThenMaxPaid() public {
        dealContract.setMinWorkers(10);
        dealContract.setWorkerCount(10);
        testCore.setCurrentEpoch(101);
        dealContract.setMaxPaidEpoch(100);

        assertEq(uint8(dealContract.getStatus()), uint8(IDeal.Status.INSUFFICIENT_FUNDS), "Status mismatc");
    }

    function test_WhenActive() public {
        dealContract.setMinWorkers(10);
        dealContract.setWorkerCount(10);
        testCore.setCurrentEpoch(100);
        dealContract.setMaxPaidEpoch(100);

        assertEq(uint8(dealContract.getStatus()), uint8(IDeal.Status.ACTIVE), "Status mismatc");
    }
}

contract TestCore {
    uint256 public currentEpoch;

    function setCurrentEpoch(uint256 epoch) public {
        currentEpoch = epoch;
    }
}

contract TestDealContract is Deal {
    //#region internal
    function _getConfigStorageTest() internal pure returns (ConfigStorage storage s) {
        bytes32 storageSlot = bytes32(uint256(keccak256("fluence.deal.storage.v1.config")) - 1);
        assembly {
            s.slot := storageSlot
        }
    }

    function _getWorkerManagerStorageTest() internal pure returns (WorkerManagerStorage storage s) {
        bytes32 storageSlot = bytes32(uint256(keccak256("fluence.deal.storage.v1.workerManager")) - 1);

        assembly {
            s.slot := storageSlot
        }
    }

    function _getDealStorageTest() internal pure returns (DealStorage storage s) {
        bytes32 storageSlot = bytes32(uint256(keccak256("fluence.deal.storage.v1")) - 1);

        assembly {
            s.slot := storageSlot
        }
    }
    //#endregion

    function setCore(address core) public {
        _getConfigStorageTest().globalCore = ICore(core);
    }

    function setWorkerCount(uint256 workerCount) public {
        _getWorkerManagerStorageTest().workerCount = workerCount;
    }

    function setMinWorkers(uint256 minWorkers) public {
        _getConfigStorageTest().minWorkers = minWorkers;
    }

    function setMaxPaidEpoch(uint256 maxPaidEpoch) public {
        _getDealStorageTest().maxPaidEpoch = maxPaidEpoch;
    }

    function setIsEnded(bool isEnded) public {
        _getDealStorageTest().isEnded = isEnded;
    }
}
