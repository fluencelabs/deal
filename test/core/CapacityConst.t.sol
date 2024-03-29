// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "forge-std/console.sol";
import "forge-std/Vm.sol";
import "forge-std/StdCheats.sol";
import "filecoin-solidity/v0.8/utils/Actor.sol";
import "src/core/Core.sol";
import "src/core/CapacityConst.sol";
import "src/core/interfaces/ICapacityConst.sol";
import "src/utils/OwnableUpgradableDiamond.sol";
import "src/core/interfaces/IEpochController.sol";
import "src/utils/BytesConverter.sol";
import "test/utils/DeployDealSystem.sol";
import "src/core/modules/market/Market.sol";
import "src/core/modules/market/interfaces/IMarket.sol";
import "test/utils/TestHelper.sol";
import "forge-std/StdCheats.sol";

interface ISetConstant {
    function setCapacityConstant(uint8 constantType, uint256 newValue) external;
}

contract CpacityConstTest is Test {
    using SafeERC20 for IERC20;
    using BytesConverter for bytes32;

    // ------------------ Events ------------------
    error OwnableUnauthorizedAccount(address account);

    // ------------------ Variables ------------------

    // ------------------ Test ------------------
    TestCapacityConst capacityConst;

    function setUp() public {
        capacityConst = TestCapacityConst(address(new ERC1967Proxy(address(new TestCapacityConst()), new bytes(0))));
    }

    function test_Init() public {
        uint256 currentEpoch = 1;
        uint256 fltPrice = 3 * PRECISION; // 1 FLT = 1 USD
        uint256 usdCollateralPerUnit = 100 * PRECISION; // 100 USD
        uint256 usdTargetRevenuePerEpoch = 1000 * PRECISION; // 1000 USD
        uint256 minDuration = 5;
        uint256 minRewardPerEpoch = 1000 ether;
        uint256 maxRewardPerEpoch = 3000 ether;
        uint256 vestingPeriodDuration = 3;
        uint256 vestingPeriodCount = 10;
        uint256 slashingRate = PRECISION / 10; // 0.1 = 10%
        uint256 minRequierdProofsPerEpoch = 10;
        uint256 maxProofsPerEpoch = 30;
        uint256 withdrawEpochsAfterFailed = 2;
        uint256 maxFailedRatio = 100;
        bytes32 difficulty = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
        uint256 initRewardPool = 1500 ether;
        address randomXProxy = address(0x123);
        address oracle = address(0x456);

        _initCapacityConst(
            fltPrice,
            usdCollateralPerUnit,
            usdTargetRevenuePerEpoch,
            minDuration,
            minRewardPerEpoch,
            maxRewardPerEpoch,
            vestingPeriodDuration,
            vestingPeriodCount,
            slashingRate,
            minRequierdProofsPerEpoch,
            maxProofsPerEpoch,
            withdrawEpochsAfterFailed,
            maxFailedRatio,
            difficulty,
            initRewardPool,
            randomXProxy,
            oracle
        );
        _verifyCapacityConst(
            currentEpoch,
            fltPrice,
            usdCollateralPerUnit,
            usdTargetRevenuePerEpoch,
            minDuration,
            minRewardPerEpoch,
            maxRewardPerEpoch,
            vestingPeriodDuration,
            vestingPeriodCount,
            slashingRate,
            minRequierdProofsPerEpoch,
            maxProofsPerEpoch,
            withdrawEpochsAfterFailed,
            maxFailedRatio,
            difficulty,
            initRewardPool,
            randomXProxy,
            oracle
        );
    }

    function test_ChangeConst() public {
        uint256 fltPrice = 3 * PRECISION; // 1 FLT = 1 USD
        uint256 usdCollateralPerUnit = 100 * PRECISION; // 100 USD
        uint256 usdTargetRevenuePerEpoch = 1000 * PRECISION; // 1000 USD
        uint256 minDuration = 5;
        uint256 minRewardPerEpoch = 1000 ether;
        uint256 maxRewardPerEpoch = 3000 ether;
        uint256 vestingPeriodDuration = 3;
        uint256 vestingPeriodCount = 10;
        uint256 slashingRate = PRECISION / 10; // 0.1 = 10%
        uint256 minProofsPerEpoch = 10;
        uint256 maxProofsPerEpoch = 30;
        uint256 withdrawEpochsAfterFailed = 2;
        uint256 maxFailedRatio = 100;
        bytes32 difficulty = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
        uint256 initRewardPool = 1500 ether;
        address randomXProxy = address(0x123);
        address oracle = address(0x456);

        _initCapacityConst(
            fltPrice,
            usdCollateralPerUnit,
            usdTargetRevenuePerEpoch,
            minDuration,
            minRewardPerEpoch,
            maxRewardPerEpoch,
            vestingPeriodDuration,
            vestingPeriodCount,
            slashingRate,
            minProofsPerEpoch,
            maxProofsPerEpoch,
            withdrawEpochsAfterFailed,
            maxFailedRatio,
            difficulty,
            initRewardPool,
            randomXProxy,
            oracle
        );

        uint256 newMinDuration = minDuration + 5;
        uint256 newUsdCollateralPerUnit = usdCollateralPerUnit + 100 * PRECISION;
        uint256 newSlashingRate = slashingRate * 2;
        uint256 newWithdrawEpochsAfterFailed = withdrawEpochsAfterFailed + 3;
        uint256 newMaxFailedRatio = maxFailedRatio + 100;
        uint256 newUsdTargetRevenuePerEpoch = usdTargetRevenuePerEpoch + 1000 * PRECISION;
        uint256 newMinRewardPerEpoch = minRewardPerEpoch + 1000 ether;
        uint256 newMaxRewardPerEpoch = maxRewardPerEpoch + 3000 ether;
        uint256 newMinProofsPerEpoch = minProofsPerEpoch + 10;
        uint256 newMaxProofsPerEpoch = maxProofsPerEpoch + 30;

        capacityConst.setCapacityConstant(ICapacityConst.CapacityConstantType.MinDuration, newMinDuration);
        assertEq(capacityConst.minDuration(), newMinDuration, "MinDuration not changed");

        capacityConst.setCapacityConstant(
            ICapacityConst.CapacityConstantType.USDCollateralPerUnit, newUsdCollateralPerUnit
        );
        assertEq(capacityConst.usdCollateralPerUnit(), newUsdCollateralPerUnit, "USDCollateralPerUnit not changed");

        capacityConst.setCapacityConstant(ICapacityConst.CapacityConstantType.SlashingRate, newSlashingRate);
        assertEq(capacityConst.slashingRate(), newSlashingRate, "SlashingRate not changed");

        capacityConst.setCapacityConstant(
            ICapacityConst.CapacityConstantType.WithdrawEpochsAfterFailed, newWithdrawEpochsAfterFailed
        );
        assertEq(
            capacityConst.withdrawEpochsAfterFailed(),
            newWithdrawEpochsAfterFailed,
            "WithdrawEpochsAfterFailed not changed"
        );

        capacityConst.setCapacityConstant(ICapacityConst.CapacityConstantType.MaxFailedRatio, newMaxFailedRatio);
        assertEq(capacityConst.maxFailedRatio(), newMaxFailedRatio, "MaxFailedRatio not changed");

        capacityConst.setCapacityConstant(
            ICapacityConst.CapacityConstantType.USDTargetRevenuePerEpoch, newUsdTargetRevenuePerEpoch
        );
        assertEq(
            capacityConst.usdTargetRevenuePerEpoch(),
            newUsdTargetRevenuePerEpoch,
            "USDTargetRevenuePerEpoch not changed"
        );

        capacityConst.setCapacityConstant(ICapacityConst.CapacityConstantType.MinRewardPerEpoch, newMinRewardPerEpoch);
        assertEq(capacityConst.minRewardPerEpoch(), newMinRewardPerEpoch, "MinRewardPerEpoch not changed");

        capacityConst.setCapacityConstant(ICapacityConst.CapacityConstantType.MaxRewardPerEpoch, newMaxRewardPerEpoch);
        assertEq(capacityConst.maxRewardPerEpoch(), newMaxRewardPerEpoch, "MaxRewardPerEpoch not changed");

        capacityConst.setCapacityConstant(ICapacityConst.CapacityConstantType.MinProofsPerEpoch, newMinProofsPerEpoch);
        assertEq(capacityConst.minProofsPerEpoch(), newMinProofsPerEpoch, "MinRequierdProofsPerEpoch not changed");

        capacityConst.setCapacityConstant(ICapacityConst.CapacityConstantType.MaxProofsPerEpoch, newMaxProofsPerEpoch);
        assertEq(capacityConst.maxProofsPerEpoch(), newMaxProofsPerEpoch, "MaxProofsPerEpoch not changed");
    }

    function test_RevertIf_ChangerNotOwner() public {
        _initCapacityConst(
            3 * PRECISION,
            100 * PRECISION,
            1000 * PRECISION,
            5,
            1000 ether,
            3000 ether,
            3,
            10,
            PRECISION / 10,
            10,
            30,
            2,
            100,
            0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
            1500 ether,
            address(0x123),
            address(0x456)
        );

        address sender = address(0x1234567890123456789012345678901234567890);
        vm.prank(sender);

        vm.expectRevert(abi.encodeWithSelector(OwnableUnauthorizedAccount.selector, sender));
        capacityConst.setCapacityConstant(ICapacityConst.CapacityConstantType.MinDuration, 10);
    }

    function test_setPrice() public {
        uint256 currentEpoch = 1;
        uint256 fltPrice = 3 * PRECISION; // 1 FLT = 1 USD
        uint256 usdCollateralPerUnit = 100 * PRECISION; // 100 USD
        uint256 usdTargetRevenuePerEpoch = 2 * PRECISION; // 1000 USD
        uint256 minDuration = 5;
        uint256 minRewardPerEpoch = 1000 ether;
        uint256 maxRewardPerEpoch = 3000 ether;
        uint256 vestingPeriodDuration = 3;
        uint256 vestingPeriodCount = 10;
        uint256 slashingRate = PRECISION / 10; // 0.1 = 10%
        uint256 minRequierdProofsPerEpoch = 10;
        uint256 maxProofsPerEpoch = 30;
        uint256 withdrawEpochsAfterFailed = 2;
        uint256 maxFailedRatio = 100;
        bytes32 difficulty = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
        uint256 initRewardPool = 1500 ether;
        address randomXProxy = address(0x123);
        address oracle = address(0x456);

        _initCapacityConst(
            fltPrice,
            usdCollateralPerUnit,
            usdTargetRevenuePerEpoch,
            minDuration,
            minRewardPerEpoch,
            maxRewardPerEpoch,
            vestingPeriodDuration,
            vestingPeriodCount,
            slashingRate,
            minRequierdProofsPerEpoch,
            maxProofsPerEpoch,
            withdrawEpochsAfterFailed,
            maxFailedRatio,
            difficulty,
            initRewardPool,
            randomXProxy,
            oracle
        );

        uint256 activeUnitCount = 10;
        capacityConst.setActiveUnitCount(activeUnitCount);

        uint256 newPrice = 4 * PRECISION;

        // #region set price in first epoch
        vm.prank(oracle);
        capacityConst.setFLTPrice(newPrice);

        assertEq(capacityConst.fltPrice(), newPrice, "fltPrice not changed");
        assertEq(
            capacityConst.fltCollateralPerUnit(),
            usdCollateralPerUnit * PRECISION / newPrice * 1e18 / PRECISION,
            "fltCollateralPerUnit not changed"
        );

        assertEq(capacityConst.getRewardPool(currentEpoch), initRewardPool, "Reward pool should not change");
        assertEq(capacityConst.getRewardPool(currentEpoch + 1), initRewardPool, "Reward pool should not change");
        // #endregion

        // #region set price in second epoch
        newPrice = 20 * PRECISION;
        uint256 nextEpoch = currentEpoch + 1;

        _skipEpochs(1);
        vm.prank(oracle);
        capacityConst.setFLTPrice(newPrice);

        assertEq(capacityConst.fltPrice(), newPrice, "second epoch: fltPrice not changed");
        assertEq(
            capacityConst.fltCollateralPerUnit(),
            usdCollateralPerUnit * PRECISION / newPrice * 1e18 / PRECISION,
            "second epoch: fltCollateralPerUnit not changed"
        );

        uint256 currentRewardPool = initRewardPool * (PRECISION / 10 * 9) / PRECISION;

        assertEq(
            capacityConst.getRewardPool(currentEpoch), initRewardPool, "second epoch: Reward pool should not change"
        );
        assertEq(capacityConst.getRewardPool(nextEpoch), currentRewardPool, "second epoch: Reward pool mismatch");
        assertEq(capacityConst.getRewardPool(nextEpoch + 1), currentRewardPool, "second epoch: Reward pool mismatch");
        // #endregion

        // #region set price in second epoch again
        newPrice = PRECISION / 20;
        vm.prank(oracle);
        capacityConst.setFLTPrice(newPrice);

        assertEq(capacityConst.fltPrice(), newPrice, "second epoch again: fltPrice not changed");
        assertEq(
            capacityConst.fltCollateralPerUnit(),
            usdCollateralPerUnit * PRECISION / newPrice * 1e18 / PRECISION,
            "second epoch again: fltCollateralPerUnit not changed"
        );

        currentRewardPool = initRewardPool * (PRECISION / 10 * 9) / PRECISION;

        assertEq(
            capacityConst.getRewardPool(currentEpoch),
            initRewardPool,
            "second epoch again: Reward pool should not change"
        );
        assertEq(capacityConst.getRewardPool(nextEpoch), currentRewardPool, "second epoch again: Reward pool mismatch");
        assertEq(
            capacityConst.getRewardPool(nextEpoch + 1), currentRewardPool, "second epoch again: Reward pool mismatch"
        );
        // #endregion
    }

    // ------------------ Internals ------------------
    function _skipEpochs(uint256 epochs) internal {
        StdCheats.skip(capacityConst.EPOCH_DURATION() * epochs);
    }

    function _initCapacityConst(
        uint256 fltPrice,
        uint256 usdCollateralPerUnit,
        uint256 usdTargetRevenuePerEpoch,
        uint256 minDuration,
        uint256 minRewardPerEpoch,
        uint256 maxRewardPerEpoch,
        uint256 vestingPeriodDuration,
        uint256 vestingPeriodCount,
        uint256 slashingRate,
        uint256 minRequierdProofsPerEpoch,
        uint256 maxProofsPerEpoch,
        uint256 withdrawEpochsAfterFailed,
        uint256 maxFailedRatio,
        bytes32 difficulty,
        uint256 initRewardPool,
        address randomXProxy,
        address oracle
    ) internal {
        capacityConst.init(
            fltPrice,
            usdCollateralPerUnit,
            usdTargetRevenuePerEpoch,
            minDuration,
            minRewardPerEpoch,
            maxRewardPerEpoch,
            vestingPeriodDuration,
            vestingPeriodCount,
            slashingRate,
            minRequierdProofsPerEpoch,
            maxProofsPerEpoch,
            withdrawEpochsAfterFailed,
            maxFailedRatio,
            difficulty,
            initRewardPool,
            randomXProxy,
            oracle
        );
        capacityConst.setOracle(oracle);
    }

    function _verifyCapacityConst(
        uint256 currentEpoch,
        uint256 fltPrice,
        uint256 usdCollateralPerUnit,
        uint256 usdTargetRevenuePerEpoch,
        uint256 minDuration,
        uint256 minRewardPerEpoch,
        uint256 maxRewardPerEpoch,
        uint256 vestingPeriodDuration,
        uint256 vestingPeriodCount,
        uint256 slashingRate,
        uint256 minRequierdProofsPerEpoch,
        uint256 maxProofsPerEpoch,
        uint256 withdrawEpochsAfterFailed,
        uint256 maxFailedRatio,
        bytes32 difficulty,
        uint256 initRewardPool,
        address randomXProxy,
        address oracle
    ) internal {
        assertEq(capacityConst.fltPrice(), fltPrice, "fltPrice mismatch");
        assertEq(capacityConst.usdCollateralPerUnit(), usdCollateralPerUnit, "usdCollateralPerUnit mismatch");
        assertEq(
            capacityConst.fltCollateralPerUnit(),
            usdCollateralPerUnit * PRECISION / fltPrice * 1e18 / PRECISION,
            "fltCollateralPerUnit mismatch"
        );
        assertEq(
            capacityConst.usdTargetRevenuePerEpoch(), usdTargetRevenuePerEpoch, "usdTargetRevenuePerEpoch mismatch"
        );
        assertEq(capacityConst.minDuration(), minDuration, "minDuration mismatch");
        assertEq(capacityConst.minRewardPerEpoch(), minRewardPerEpoch, "minRewardPerEpoch mismatch");
        assertEq(capacityConst.maxRewardPerEpoch(), maxRewardPerEpoch, "maxRewardPerEpoch mismatch");
        assertEq(capacityConst.vestingPeriodDuration(), vestingPeriodDuration, "vestingPeriodDuration mismatch");
        assertEq(capacityConst.vestingPeriodCount(), vestingPeriodCount, "vestingPeriodCount mismatch");
        assertEq(capacityConst.slashingRate(), slashingRate, "slashingRate mismatch");
        assertEq(capacityConst.minProofsPerEpoch(), minRequierdProofsPerEpoch, "minRequierdProofsPerEpoch mismatch");
        assertEq(capacityConst.maxProofsPerEpoch(), maxProofsPerEpoch, "maxProofsPerEpoch mismatch");
        assertEq(
            capacityConst.withdrawEpochsAfterFailed(), withdrawEpochsAfterFailed, "withdrawEpochsAfterFailed mismatch"
        );
        assertEq(capacityConst.maxFailedRatio(), maxFailedRatio, "maxFailedRatio mismatch");
        assertEq(capacityConst.difficulty(), difficulty, "difficulty mismatch");
        assertEq(capacityConst.randomXProxy(), randomXProxy, "randomXProxy mismatch");
        assertEq(capacityConst.oracle(), oracle, "oracle mismatch");
        assertEq(capacityConst.getRewardPool(currentEpoch), initRewardPool, "initRewardPool mismatch");
    }
}

contract TestCapacityConst is CapacityConst {
    uint256 public constant EPOCH_DURATION = 1 days;

    function init(
        uint256 fltPrice_,
        uint256 usdCollateralPerUnit_,
        uint256 usdTargetRevenuePerEpoch_,
        uint256 minDuration_,
        uint256 minRewardPerEpoch_,
        uint256 maxRewardPerEpoch_,
        uint256 vestingPeriodDuration_,
        uint256 vestingPeriodCount_,
        uint256 slashingRate_,
        uint256 minRequierdProofsPerEpoch_,
        uint256 maxProofsPerEpoch_,
        uint256 withdrawEpochsAfterFailed_,
        uint256 maxFailedRatio_,
        bytes32 difficulty_,
        uint256 initRewardPool_,
        address randomXProxy_,
        address oracle_
    ) public initializer {
        __EpochController_init(EPOCH_DURATION);
        __Ownable_init(msg.sender);
        __CapacityConst_init(
            fltPrice_,
            usdCollateralPerUnit_,
            usdTargetRevenuePerEpoch_,
            minDuration_,
            minRewardPerEpoch_,
            maxRewardPerEpoch_,
            vestingPeriodDuration_,
            vestingPeriodCount_,
            slashingRate_,
            minRequierdProofsPerEpoch_,
            maxProofsPerEpoch_,
            withdrawEpochsAfterFailed_,
            maxFailedRatio_,
            difficulty_,
            initRewardPool_,
            randomXProxy_
        );
        setOracle(oracle_);
    }

    function setActiveUnitCount(uint256 activeUnitCount_) public {
        _setActiveUnitCount(activeUnitCount_);
    }
}
