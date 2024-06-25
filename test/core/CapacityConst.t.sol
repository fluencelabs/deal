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
import {StdCheats} from "forge-std/StdCheats.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {PRECISION} from "src/utils/Common.sol";
import {ICapacityConstWithPublicInternals} from "src/dev/test/interfaces/ICapacityConstWithPublicInternals.sol";
import {ICapacityConst} from "src/core/interfaces/ICapacityConst.sol";
import {TestWithDeployment} from "test/utils/TestWithDeployment.sol";
import {TestHelper} from "test/utils/TestHelper.sol";

interface ISetConstant {
    function setCapacityConstant(uint8 constantType, uint256 newValue) external;
}

contract CapacityConstTest is TestWithDeployment {
    using SafeERC20 for IERC20;

    address constant NOT_AN_OWNER = address(1234);

    ICapacityConst capacityConst;

    function setUp() public {
        capacityConst = ICapacityConst(
            deployCode("out/CapacityConstWithPublicInternals.sol/CapacityConstWithPublicInternals.json")
        );
    }

    function test_Init() public {
        uint256 currentEpoch = 1;

        ICapacityConst.CapacityConstInitArgs memory args = ICapacityConst.CapacityConstInitArgs({
            fltPrice: 3 * PRECISION, // 1 FLT = 1 USD
            usdCollateralPerUnit: 100 * PRECISION, // 100 USD
            usdTargetRevenuePerEpoch: 1000 * PRECISION, // 1000 USD
            minDuration: 5,
            minRewardPerEpoch: 1000 ether,
            maxRewardPerEpoch: 3000 ether,
            vestingPeriodDuration: 3,
            vestingPeriodCount: 10,
            slashingRate: PRECISION / 10, // 0.1 = 10%
            minProofsPerEpoch: 10,
            maxProofsPerEpoch: 30,
            withdrawEpochsAfterFailed: 2,
            maxFailedRatio: 100,
            difficulty: 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
            initRewardPool: 1500 ether,
            randomXProxy: address(0x123),
            oracle: address(456)
        });

        _initCapacityConst(args);
        _verifyCapacityConst(currentEpoch, args);
    }

    function test_ChangeConst() public {
        ICapacityConst.CapacityConstInitArgs memory args = ICapacityConst.CapacityConstInitArgs({
            fltPrice: 3 * PRECISION, // 1 FLT = 1 USD
            usdCollateralPerUnit: 100 * PRECISION, // 100 USD
            usdTargetRevenuePerEpoch: 1000 * PRECISION, // 1000 USD
            minDuration: 5,
            minRewardPerEpoch: 1000 ether,
            maxRewardPerEpoch: 3000 ether,
            vestingPeriodDuration: 3,
            vestingPeriodCount: 10,
            slashingRate: PRECISION / 10, // 0.1 = 10%
            minProofsPerEpoch: 10,
            maxProofsPerEpoch: 30,
            withdrawEpochsAfterFailed: 2,
            maxFailedRatio: 100,
            difficulty: 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
            initRewardPool: 1500 ether,
            randomXProxy: address(0x123),
            oracle: address(456)
        });

        _initCapacityConst(args);

        uint256 newMinDuration = args.minDuration + 5;
        uint256 newUsdCollateralPerUnit = args.usdCollateralPerUnit + 100 * PRECISION;
        uint256 newSlashingRate = args.slashingRate * 2;
        uint256 newWithdrawEpochsAfterFailed = args.withdrawEpochsAfterFailed + 3;
        uint256 newMaxFailedRatio = args.maxFailedRatio + 100;
        uint256 newUsdTargetRevenuePerEpoch = args.usdTargetRevenuePerEpoch + 1000 * PRECISION;
        uint256 newMinRewardPerEpoch = args.minRewardPerEpoch + 1000 ether;
        uint256 newMaxRewardPerEpoch = args.maxRewardPerEpoch + 3000 ether;
        uint256 newMinProofsPerEpoch = args.minProofsPerEpoch + 10;
        uint256 newMaxProofsPerEpoch = args.maxProofsPerEpoch + 30;

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
        assertEq(capacityConst.minProofsPerEpoch(), newMinProofsPerEpoch, "MinRequiredProofsPerEpoch not changed");

        capacityConst.setCapacityConstant(ICapacityConst.CapacityConstantType.MaxProofsPerEpoch, newMaxProofsPerEpoch);
        assertEq(capacityConst.maxProofsPerEpoch(), newMaxProofsPerEpoch, "MaxProofsPerEpoch not changed");
    }

    function test_RevertIf_ChangerNotOwner() public {
        ICapacityConst.CapacityConstInitArgs memory args = ICapacityConst.CapacityConstInitArgs({
            fltPrice: 3 * PRECISION, // 1 FLT = 1 USD
            usdCollateralPerUnit: 100 * PRECISION, // 100 USD
            usdTargetRevenuePerEpoch: 1000 * PRECISION, // 1000 USD
            minDuration: 5,
            minRewardPerEpoch: 1000 ether,
            maxRewardPerEpoch: 3000 ether,
            vestingPeriodDuration: 3,
            vestingPeriodCount: 10,
            slashingRate: PRECISION / 10, // 0.1 = 10%
            minProofsPerEpoch: 10,
            maxProofsPerEpoch: 30,
            withdrawEpochsAfterFailed: 2,
            maxFailedRatio: 100,
            difficulty: 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
            initRewardPool: 1500 ether,
            randomXProxy: address(0x123),
            oracle: address(456)
        });
        _initCapacityConst(args);

        address sender = address(0x1234567890123456789012345678901234567890);
        vm.startPrank(sender);

        vm.expectRevert("LibDiamond: Must be contract owner");
        capacityConst.setCapacityConstant(ICapacityConst.CapacityConstantType.MinDuration, 10);
        vm.stopPrank();
    }

    function test_setPrice() public {
        uint256 currentEpoch = 1;

        ICapacityConst.CapacityConstInitArgs memory args = ICapacityConst.CapacityConstInitArgs({
            fltPrice: 3 * PRECISION, // 1 FLT = 1 USD
            usdCollateralPerUnit: 100 * PRECISION, // 100 USD
            usdTargetRevenuePerEpoch: 1000 * PRECISION, // 1000 USD
            minDuration: 5,
            minRewardPerEpoch: 1000 ether,
            maxRewardPerEpoch: 3000 ether,
            vestingPeriodDuration: 3,
            vestingPeriodCount: 10,
            slashingRate: PRECISION / 10, // 0.1 = 10%
            minProofsPerEpoch: 10,
            maxProofsPerEpoch: 30,
            withdrawEpochsAfterFailed: 2,
            maxFailedRatio: 100,
            difficulty: 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
            initRewardPool: 1500 ether,
            randomXProxy: address(0x123),
            oracle: address(456)
        });

        _initCapacityConst(args);

        uint256 activeUnitCount = 10;
       ICapacityConstWithPublicInternals(address(capacityConst)).setActiveUnitCount(activeUnitCount);

        uint256 newPrice = 4 * PRECISION;

        // #region set price in first epoch
        vm.startPrank(NOT_AN_OWNER);
        vm.expectRevert("LibDiamond: Must be contract owner");
        capacityConst.setOracle(address(12345678));
        vm.stopPrank();

        capacityConst.setOracle(address(12345678));

        vm.expectRevert("Only oracle can set FLT price");
        capacityConst.setFLTPrice(newPrice);

        vm.expectEmit(false, false, false, true);
        emit ICapacityConst.OracleSet(args.oracle);
        capacityConst.setOracle(args.oracle);

        vm.startPrank(args.oracle);
        vm.expectEmit(false, false, false, true);
        emit ICapacityConst.FLTPriceUpdated(newPrice);
        capacityConst.setFLTPrice(newPrice);
        vm.stopPrank();

        assertEq(capacityConst.fltPrice(), newPrice, "fltPrice not changed");
        assertEq(
            capacityConst.fltCollateralPerUnit(),
            args.usdCollateralPerUnit * PRECISION / newPrice * 1e18 / PRECISION,
            "fltCollateralPerUnit not changed"
        );

        assertEq(capacityConst.getRewardPool(currentEpoch), args.initRewardPool, "Reward pool should not change");
        assertEq(capacityConst.getRewardPool(currentEpoch + 1), args.initRewardPool, "Reward pool should not change");
        // #endregion

        // #region set price in second epoch
        newPrice = 20 * PRECISION;
        uint256 nextEpoch = currentEpoch + 1;

        _skipEpochs(1);
        vm.startPrank(args.oracle);
        capacityConst.setFLTPrice(newPrice);
        vm.stopPrank();

        assertEq(capacityConst.fltPrice(), newPrice, "second epoch: fltPrice not changed");
        assertEq(
            capacityConst.fltCollateralPerUnit(),
            args.usdCollateralPerUnit * PRECISION / newPrice * 1e18 / PRECISION,
            "second epoch: fltCollateralPerUnit not changed"
        );

        uint256 currentRewardPool = args.initRewardPool * (PRECISION / 10 * 9) / PRECISION;

        assertEq(
            capacityConst.getRewardPool(currentEpoch), args.initRewardPool, "second epoch: Reward pool should not change"
        );
        assertEq(capacityConst.getRewardPool(nextEpoch), currentRewardPool, "second epoch: Reward pool mismatch");
        assertEq(capacityConst.getRewardPool(nextEpoch + 1), currentRewardPool, "second epoch: Reward pool mismatch");
        // #endregion

        // #region set price in second epoch again
        newPrice = PRECISION / 20;
        vm.startPrank(args.oracle);
        capacityConst.setFLTPrice(newPrice);
        vm.stopPrank();

        assertEq(capacityConst.fltPrice(), newPrice, "second epoch again: fltPrice not changed");
        assertEq(
            capacityConst.fltCollateralPerUnit(),
            args.usdCollateralPerUnit * PRECISION / newPrice * 1e18 / PRECISION,
            "second epoch again: fltCollateralPerUnit not changed"
        );

        currentRewardPool = args.initRewardPool * (PRECISION / 10 * 9) / PRECISION;

        assertEq(
            capacityConst.getRewardPool(currentEpoch),
            args.initRewardPool,
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
        StdCheats.skip(capacityConst.epochDuration() * epochs);
    }

    function _initCapacityConst(ICapacityConst.CapacityConstInitArgs memory args) internal {
        ICapacityConstWithPublicInternals(address(capacityConst)).init(args);
    }

    event Ver1();

    function _verifyCapacityConst(uint256 currentEpoch, ICapacityConst.CapacityConstInitArgs memory args) internal {
        emit Ver1();
        assertEq(capacityConst.fltPrice(), args.fltPrice, "fltPrice mismatch");
        assertEq(capacityConst.usdCollateralPerUnit(), args.usdCollateralPerUnit, "usdCollateralPerUnit mismatch");
        assertEq(
            capacityConst.fltCollateralPerUnit(),
            args.usdCollateralPerUnit * PRECISION / args.fltPrice * 1e18 / PRECISION,
            "fltCollateralPerUnit mismatch"
        );
        assertEq(
            capacityConst.usdTargetRevenuePerEpoch(), args.usdTargetRevenuePerEpoch, "usdTargetRevenuePerEpoch mismatch"
        );
        assertEq(capacityConst.minDuration(), args.minDuration, "minDuration mismatch");
        assertEq(capacityConst.minRewardPerEpoch(), args.minRewardPerEpoch, "minRewardPerEpoch mismatch");
        assertEq(capacityConst.maxRewardPerEpoch(), args.maxRewardPerEpoch, "maxRewardPerEpoch mismatch");
        assertEq(capacityConst.vestingPeriodDuration(), args.vestingPeriodDuration, "vestingPeriodDuration mismatch");
        assertEq(capacityConst.vestingPeriodCount(), args.vestingPeriodCount, "vestingPeriodCount mismatch");
        assertEq(capacityConst.slashingRate(), args.slashingRate, "slashingRate mismatch");
        assertEq(capacityConst.minProofsPerEpoch(), args.minProofsPerEpoch, "minProofsPerEpoch mismatch");
        assertEq(capacityConst.maxProofsPerEpoch(), args.maxProofsPerEpoch, "maxProofsPerEpoch mismatch");
        assertEq(
            capacityConst.withdrawEpochsAfterFailed(),
            args.withdrawEpochsAfterFailed,
            "withdrawEpochsAfterFailed mismatch"
        );
        assertEq(capacityConst.maxFailedRatio(), args.maxFailedRatio, "maxFailedRatio mismatch");
        assertEq(capacityConst.difficulty(), args.difficulty, "difficulty mismatch");
        assertEq(capacityConst.randomXProxy(), args.randomXProxy, "randomXProxy mismatch");
        assertEq(capacityConst.getRewardPool(currentEpoch), args.initRewardPool, "initRewardPool mismatch");
    }
}
