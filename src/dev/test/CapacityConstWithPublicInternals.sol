// SPDX-License-Identifier: Apache-2.0
// only for tests
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
