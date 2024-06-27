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

import {CapacityConst} from "src/core/CapacityConst.sol";
import {ICapacityConstWithPublicInternals} from "src/dev/test/interfaces/ICapacityConstWithPublicInternals.sol";
import {LibCapacityConst, CapacityConstStorage, RewardPoolPerEpoch} from "src/lib/LibCapacityConst.sol";
import {LibEpochController} from "src/lib/LibEpochController.sol";
import {LibDiamond} from "src/lib/LibDiamond.sol";


contract CapacityConstWithPublicInternals is ICapacityConstWithPublicInternals, CapacityConst {
    uint256 public constant EPOCH_DURATION = 1 days;
    uint256 public constant INITIAL_EPOCH = 1;

    constructor () {
        LibDiamond.diamondStorage().contractOwner = msg.sender;
        LibEpochController.store().epochDuration = EPOCH_DURATION;
    }

    function setActiveUnitCount(uint256 activeUnitCount_) external {
        LibCapacityConst.setActiveUnitCount(activeUnitCount_);
    }

    event Init(uint256) anonymous;

    function init(CapacityConstInitArgs memory initArgs) external {
        emit Init(0x111);
        CapacityConstStorage storage constantsStorage = LibCapacityConst.store();
        constantsStorage.commitment.minDuration = initArgs.minDuration;
        constantsStorage.commitment.usdCollateralPerUnit = initArgs.usdCollateralPerUnit;
        constantsStorage.commitment.slashingRate = initArgs.slashingRate;
        constantsStorage.commitment.withdrawEpochsAfterFailed = initArgs.withdrawEpochsAfterFailed;
        constantsStorage.commitment.maxFailedRatio = initArgs.maxFailedRatio;

        constantsStorage.reward.usdTargetRevenuePerEpoch = initArgs.usdTargetRevenuePerEpoch;
        constantsStorage.reward.minRewardPerEpoch = initArgs.minRewardPerEpoch;
        constantsStorage.reward.maxRewardPerEpoch = initArgs.maxRewardPerEpoch;
        constantsStorage.reward.vestingPeriodDuration = initArgs.vestingPeriodDuration;
        constantsStorage.reward.vestingPeriodCount = initArgs.vestingPeriodCount;

        constantsStorage.proof.minProofsPerEpoch = initArgs.minProofsPerEpoch;
        constantsStorage.proof.maxProofsPerEpoch = initArgs.maxProofsPerEpoch;
        constantsStorage.proof.difficulty = initArgs.difficulty;
        constantsStorage.proof.nextDifficulty = initArgs.difficulty;

        constantsStorage.randomXProxy = initArgs.randomXProxy;
        constantsStorage.oracle = initArgs.oracle;

        constantsStorage.reward.rewardPoolPerEpochs.push(
            RewardPoolPerEpoch({epoch: INITIAL_EPOCH, value: initArgs.initRewardPool})
        );

        constantsStorage.fltPrice = initArgs.fltPrice;
        constantsStorage.commitment.fltCollateralPerUnit =
            LibCapacityConst._calcFLTCollateralPerUnit(initArgs.usdCollateralPerUnit, initArgs.fltPrice);
        emit Init(0x222);
    }
}
