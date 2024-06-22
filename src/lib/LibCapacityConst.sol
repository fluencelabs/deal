// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {PRECISION} from "src/utils/Common.sol";
import {LibEpochController} from "src/lib/LibEpochController.sol";

struct CommitmentConst {
    uint256 minDuration;
    uint256 usdCollateralPerUnit;
    uint256 fltCollateralPerUnit;
    uint256 slashingRate;
    uint256 withdrawEpochsAfterFailed;
    uint256 maxFailedRatio;
}

struct ProofConst {
    uint256 minProofsPerEpoch;
    uint256 maxProofsPerEpoch;
    bytes32 difficulty;
    bytes32 nextDifficulty;
    uint256 difficultyChangeEpoch;
}

struct RewardConst {
    uint256 usdTargetRevenuePerEpoch;
    uint256 minRewardPerEpoch;
    uint256 maxRewardPerEpoch;
    uint256 vestingPeriodDuration;
    uint256 vestingPeriodCount;
    RewardPoolPerEpoch[] rewardPoolPerEpochs;
}

struct CapacityConstStorage {
    uint256 fltPrice;
    address randomXProxy;
    uint256 activeUnitCount;
    CommitmentConst commitment;
    ProofConst proof;
    RewardConst reward;
    address oracle;
}

struct RewardPoolPerEpoch {
    uint256 epoch;
    uint256 value;
}


library LibCapacityConst {
    uint256 internal constant _REWARD_POOL_SHRINK_RATE = PRECISION / 10 * 9; // 0.9 = 90%
    uint256 internal constant _REWARD_POOL_GROWTH_RATE = PRECISION + PRECISION / 10; // 1.1 = 110%
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.capacity.storage.v1.const")) - 1);

    function store() internal pure returns (CapacityConstStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    function _calcFLTCollateralPerUnit(uint256 usdCollateralPerUnit_, uint256 fltPrice_)
        internal
        pure
        returns (uint256)
    {
        return usdCollateralPerUnit_ * PRECISION / fltPrice_ * 1e18 / PRECISION;
    }

    function fltPrice() internal view returns (uint256) {
        return store().fltPrice;
    }

    function fltCollateralPerUnit() internal view returns (uint256) {
        return store().commitment.fltCollateralPerUnit;
    }

    function usdCollateralPerUnit() internal view returns (uint256) {
        return store().commitment.usdCollateralPerUnit;
    }

    function usdTargetRevenuePerEpoch() internal view returns (uint256) {
        return store().reward.usdTargetRevenuePerEpoch;
    }

    function minDuration() internal view returns (uint256) {
        return store().commitment.minDuration;
    }

    function minRewardPerEpoch() internal view returns (uint256) {
        return store().reward.minRewardPerEpoch;
    }

    function maxRewardPerEpoch() internal view returns (uint256) {
        return store().reward.maxRewardPerEpoch;
    }

    function vestingPeriodDuration() internal view returns (uint256) {
        return store().reward.vestingPeriodDuration;
    }

    function vestingPeriodCount() internal view returns (uint256) {
        return store().reward.vestingPeriodCount;
    }

    function slashingRate() internal view returns (uint256) {
        return store().commitment.slashingRate;
    }

    function minProofsPerEpoch() internal view returns (uint256) {
        return store().proof.minProofsPerEpoch;
    }

    function maxProofsPerEpoch() internal view returns (uint256) {
        return store().proof.maxProofsPerEpoch;
    }

    function withdrawEpochsAfterFailed() internal view returns (uint256) {
        return store().commitment.withdrawEpochsAfterFailed;
    }

    function maxFailedRatio() internal view returns (uint256) {
        return store().commitment.maxFailedRatio;
    }

    function activeUnitCount() internal view returns (uint256) {
        return store().activeUnitCount;
    }

    function difficulty() internal view returns (bytes32) {
        CapacityConstStorage storage constantsStorage = store();
        if (LibEpochController.currentEpoch() >= constantsStorage.proof.difficultyChangeEpoch) {
            return constantsStorage.proof.nextDifficulty;
        }

        return store().proof.difficulty;
    }

    function randomXProxy() internal view returns (address) {
        return store().randomXProxy;
    }

    function oracle() internal view returns (address) {
        return store().oracle;
    }

    function getRewardPool(uint256 epoch) internal view returns (uint256) {
        CapacityConstStorage storage constantsStorage = store();

        uint256 length = constantsStorage.reward.rewardPoolPerEpochs.length;
        uint256 low = 0;
        uint256 high = length - 1;

        uint256 value = 0;
        while (low <= high) {
            uint256 mid = (low + high) / 2;
            RewardPoolPerEpoch storage rewardPool = constantsStorage.reward.rewardPoolPerEpochs[mid];
            uint256 rewardPoolEpoch = rewardPool.epoch;
            if (epoch > rewardPoolEpoch) {
                value = rewardPool.value;
                low = mid + 1;
            } else if (epoch < rewardPoolEpoch) {
                high = mid - 1;
            } else {
                return rewardPool.value;
            }
        }

        return value;
    }

    function _setActiveUnitCount(uint256 activeUnitCount_) internal {
        CapacityConstStorage storage constantsStorage = store();

        constantsStorage.activeUnitCount = activeUnitCount_;
        _setRewardPool(constantsStorage.fltPrice, activeUnitCount_);
    }

    function _setRewardPool(uint256 fltPrice_, uint256 activeUnitCount_) internal {
        CapacityConstStorage storage constantsStorage = store();
        uint256 currentEpoch_ = LibEpochController.currentEpoch();

        // load last reward pool
        uint256 length = constantsStorage.reward.rewardPoolPerEpochs.length;

        if (activeUnitCount_ <= 0) {
            return;
        }

        uint256 lastRewardPoolValue;
        uint256 lastRewardPoolEpoch;

        RewardPoolPerEpoch storage lastRewardPool = constantsStorage.reward.rewardPoolPerEpochs[length - 1];
        lastRewardPoolEpoch = lastRewardPool.epoch;

        if (currentEpoch_ == lastRewardPool.epoch) {
            if (length < 2) {
                return;
            }

            lastRewardPoolValue = constantsStorage.reward.rewardPoolPerEpochs[length - 2].value;
        } else {
            lastRewardPoolValue = lastRewardPool.value;
        }

        uint256 currentTarget = lastRewardPoolValue * fltPrice_ / activeUnitCount_;

        // calculate new reward pool
        uint256 newRewardPool;
        if (currentTarget > constantsStorage.reward.usdTargetRevenuePerEpoch) {
            uint256 minRewardPerEpoch_ = constantsStorage.reward.minRewardPerEpoch;
            newRewardPool = lastRewardPoolValue * _REWARD_POOL_SHRINK_RATE / PRECISION;
            if (newRewardPool < minRewardPerEpoch_) {
                newRewardPool = minRewardPerEpoch_;
            }
        } else {
            uint256 maxRewardPerEpoch_ = constantsStorage.reward.maxRewardPerEpoch;
            newRewardPool = lastRewardPoolValue * _REWARD_POOL_GROWTH_RATE / PRECISION;
            if (newRewardPool > maxRewardPerEpoch_) {
                newRewardPool = maxRewardPerEpoch_;
            }
        }

        // save new reward pool
        if (currentEpoch_ == lastRewardPoolEpoch) {
            constantsStorage.reward.rewardPoolPerEpochs[length - 1].value = newRewardPool;
        } else {
            constantsStorage.reward.rewardPoolPerEpochs.push(
                RewardPoolPerEpoch({epoch: currentEpoch_, value: newRewardPool})
            );
        }
    }
}
