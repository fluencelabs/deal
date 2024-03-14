// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "src/core/modules/BaseModule.sol";
import {PRECISION, GlobalConst} from "src/core/GlobalConst.sol";
import "./interfaces/ICapacityConst.sol";

contract CapacityConst is BaseModule, ICapacityConst {
    // #region ------------------ Constants ------------------
    uint256 internal constant _REWARD_POOL_SHRINK_RATE = PRECISION / 10 * 9; // 0.9 = 90%
    uint256 internal constant _REWARD_POOL_GROWTH_RATE = PRECISION + PRECISION / 10; // 1.1 = 110%
    // #endregion ------------------ Constants ------------------

    // #region ------------------ Types ------------------
    struct RewardPoolPerEpoch {
        uint256 epoch;
        /// FLT
        uint256 value;
    }
    // #endregion ------------------ Types ------------------

    // #region ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.capacity.storage.v1.const")) - 1);

    struct CommitmentConst {
        // in epochs
        uint256 minDuration;
        /// USD/CU
        uint256 usdCollateralPerUnit;
        /// FLT/CU
        uint256 fltCollateralPerUnit;
        // percent per epoch
        uint256 slashingRate;
        uint256 withdrawEpochesAfterFailed;
        /// Fails/CU
        uint256 maxFailedRatio;
    }

    struct ProofConst {
        uint256 minRequierdProofsPerEpoch;
        uint256 maxProofsPerEpoch;
        bytes32 difficulty;
        bytes32 nextDifficulty;
        uint256 difficultyChangeEpoch;
    }

    struct RewardConst {
        // how much reward each CU will receive per epoch in USD
        // each CU will receive reward around this parameters
        // USD/CU
        uint256 usdTargetRevenuePerEpoch;

        // bounds for RewardPoolPerEpoch.value
        uint256 minRewardPerEpoch;
        uint256 maxRewardPerEpoch;

        // how long will reward be vested
        // TODO: figure out?
        uint256 vestingPeriodDuration;
        uint256 vestingPeriodCount;

        // represent an array of exact reward count in FLT per some epoch
        //
        RewardPoolPerEpoch[] rewardPoolPerEpoches;
    }

    struct ConstStorage {
        /// USD/FLT
        uint256 fltPrice;
        address randomXProxy;
        uint256 activeUnitCount;
        CommitmentConst commitment;
        ProofConst proof;
        RewardConst reward;
    }

    function _getConstStorage() private pure returns (ConstStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }
    // #endregion ------------------ Storage ------------------

    // #region ------------------ Initializer ------------------
    constructor(ICore core_) BaseModule(core_) {}

    function __CapacityConst_init(
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
        uint256 withdrawEpochesAfterFailed_,
        uint256 maxFailedRatio_,
        bytes32 difficulty_,
        uint256 initRewardPool_,
        address randomXProxy_
    ) internal onlyInitializing {
        ConstStorage storage constantsStorage = _getConstStorage();

        constantsStorage.commitment.minDuration = minDuration_;
        constantsStorage.commitment.usdCollateralPerUnit = usdCollateralPerUnit_;
        constantsStorage.commitment.slashingRate = slashingRate_;
        constantsStorage.commitment.withdrawEpochesAfterFailed = withdrawEpochesAfterFailed_;
        constantsStorage.commitment.maxFailedRatio = maxFailedRatio_;

        constantsStorage.reward.usdTargetRevenuePerEpoch = usdTargetRevenuePerEpoch_;
        constantsStorage.reward.minRewardPerEpoch = minRewardPerEpoch_;
        constantsStorage.reward.maxRewardPerEpoch = maxRewardPerEpoch_;
        constantsStorage.reward.vestingPeriodDuration = vestingPeriodDuration_;
        constantsStorage.reward.vestingPeriodCount = vestingPeriodCount_;

        constantsStorage.proof.minRequierdProofsPerEpoch = minRequierdProofsPerEpoch_;
        constantsStorage.proof.maxProofsPerEpoch = maxProofsPerEpoch_;
        constantsStorage.proof.difficulty = difficulty_;
        constantsStorage.proof.nextDifficulty = difficulty_;

        constantsStorage.randomXProxy = randomXProxy_;

        constantsStorage.reward.rewardPoolPerEpoches.push(
            RewardPoolPerEpoch({epoch: core.currentEpoch(), value: initRewardPool_})
        );

        constantsStorage.fltPrice = fltPrice_;
        constantsStorage.commitment.fltCollateralPerUnit = usdCollateralPerUnit_ / fltPrice_;
    }
    // #endregion ------------------ Initializer ------------------

    // #region ------------------ External View Functions ------------------
    function fltPrice() public view returns (uint256) {
        return _getConstStorage().fltPrice;
    }

    function fltCollateralPerUnit() public view returns (uint256) {
        return _getConstStorage().commitment.fltCollateralPerUnit;
    }

    function usdCollateralPerUnit() public view returns (uint256) {
        return _getConstStorage().commitment.usdCollateralPerUnit;
    }

    function usdTargetRevenuePerEpoch() public view returns (uint256) {
        return _getConstStorage().reward.usdTargetRevenuePerEpoch;
    }

    function minDuration() public view returns (uint256) {
        return _getConstStorage().commitment.minDuration;
    }

    function minRewardPerEpoch() public view returns (uint256) {
        return _getConstStorage().reward.minRewardPerEpoch;
    }

    function maxRewardPerEpoch() public view returns (uint256) {
        return _getConstStorage().reward.maxRewardPerEpoch;
    }

    function vestingPeriodDuration() public view returns (uint256) {
        return _getConstStorage().reward.vestingPeriodDuration;
    }

    function vestingPeriodCount() public view returns (uint256) {
        return _getConstStorage().reward.vestingPeriodCount;
    }

    function slashingRate() public view returns (uint256) {
        return _getConstStorage().commitment.slashingRate;
    }

    function minRequierdProofsPerEpoch() public view returns (uint256) {
        return _getConstStorage().proof.minRequierdProofsPerEpoch;
    }

    function maxProofsPerEpoch() public view returns (uint256) {
        return _getConstStorage().proof.maxProofsPerEpoch;
    }

    function withdrawEpochesAfterFailed() public view returns (uint256) {
        return _getConstStorage().commitment.withdrawEpochesAfterFailed;
    }

    function maxFailedRatio() public view returns (uint256) {
        return _getConstStorage().commitment.maxFailedRatio;
    }

    function activeUnitCount() public view returns (uint256) {
        return _getConstStorage().activeUnitCount;
    }

    function difficulty() public view returns (bytes32) {
        ConstStorage storage constantsStorage = _getConstStorage();
        if (core.currentEpoch() >= constantsStorage.proof.difficultyChangeEpoch) {
            return constantsStorage.proof.nextDifficulty;
        }

        return _getConstStorage().proof.difficulty;
    }

    function randomXProxy() public view returns (address) {
        return _getConstStorage().randomXProxy;
    }

    /// Q: why should I care about prices in old epochs
    function getRewardPool(uint256 epoch) public view returns (uint256) {
        ConstStorage storage constantsStorage = _getConstStorage();

        uint256 length = constantsStorage.reward.rewardPoolPerEpoches.length;
        uint256 low = 0;
        uint256 high = length - 1;

        uint256 value = 0;
        while (low <= high) {
            uint256 mid = (low + high) / 2;
            RewardPoolPerEpoch storage rewardPool = constantsStorage.reward.rewardPoolPerEpoches[mid];
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
    // #endregion ------------------ External View Functions ------------------

    // #region ------------------ External Mutable Functions ------------------
    function setFLTPrice(uint256 fltPrice_) public onlyCoreOwner {
        ConstStorage storage constantsStorage = _getConstStorage();
        constantsStorage.fltPrice = fltPrice_;

        _setRewardPool(fltPrice_, constantsStorage.activeUnitCount);
        constantsStorage.commitment.fltCollateralPerUnit = constantsStorage.commitment.usdCollateralPerUnit / fltPrice_;

        emit FLTPriceUpdated(fltPrice_);
    }

    function setDifficulty(bytes32 difficulty_) external onlyCoreOwner {
        ConstStorage storage constantsStorage = _getConstStorage();
        constantsStorage.proof.difficulty = constantsStorage.proof.nextDifficulty;
        constantsStorage.proof.nextDifficulty = difficulty_;
        constantsStorage.proof.difficultyChangeEpoch = core.currentEpoch() + 1;

        emit DifficultyUpdated(difficulty_);
    }

    function setConstant(ConstantType constantType, uint256 v) external onlyCoreOwner {
        ConstStorage storage constantsStorage = _getConstStorage();

        // capacity section
        if (constantType == ConstantType.MinDuration) {
            constantsStorage.commitment.minDuration = v;
        } else if (constantType == ConstantType.USDCollateralPerUnit) {
            constantsStorage.commitment.usdCollateralPerUnit = v;
            constantsStorage.commitment.fltCollateralPerUnit = v / constantsStorage.fltPrice;
        } else if (constantType == ConstantType.SlashingRate) {
            constantsStorage.commitment.slashingRate = v;
        } else if (constantType == ConstantType.WithdrawEpochesAfterFailed) {
            constantsStorage.commitment.withdrawEpochesAfterFailed = v;
        } else if (constantType == ConstantType.MaxFailedRatio) {
            constantsStorage.commitment.maxFailedRatio = v;
        }
        // reward section
        else if (constantType == ConstantType.USDTargetRevenuePerEpoch) {
            // Why we don't call _setRewardPool here
            constantsStorage.reward.usdTargetRevenuePerEpoch = v;
        } else if (constantType == ConstantType.MinRewardPerEpoch) {
            constantsStorage.reward.minRewardPerEpoch = v;
        } else if (constantType == ConstantType.MaxRewardPerEpoch) {
            constantsStorage.reward.maxRewardPerEpoch = v;
        }
        // proof section
        else if (constantType == ConstantType.MinRequierdProofsPerEpoch) {
            constantsStorage.proof.minRequierdProofsPerEpoch = v;
        } else if (constantType == ConstantType.MaxProofsPerEpoch) {
            constantsStorage.proof.maxProofsPerEpoch = v;
        } else {
            revert("GlobalConst: unknown constant type");
        }

        emit ConstantUpdated(constantType, v);
    }
    // #endregion ------------------ External Mutable Functions ------------------

    // #region ------------------ Internal Mutable Functions ------------------
    function _setActiveUnitCount(uint256 activeUnitCount_) internal {
        ConstStorage storage constantsStorage = _getConstStorage();

        constantsStorage.activeUnitCount = activeUnitCount_;
        _setRewardPool(constantsStorage.fltPrice, activeUnitCount_);
    }

    /// guarantee that a new array value will differ from the previous in 10%
    /// in other words, foreach i, |rewardPoolPerEpoches[i], rewardPoolPerEpoches[i+1]| = 10%
    // _setRewardPool(10, 5), 10 USD/FLT
    function _setRewardPool(uint256 fltPrice_, uint256 activeUnitCount_) internal {
        ConstStorage storage constantsStorage = _getConstStorage();
        uint256 currentEpoch_ = core.currentEpoch();

        // load last reward pool
        uint256 length = constantsStorage.reward.rewardPoolPerEpoches.length;

        if (activeUnitCount_ <= 0) {
            return;
        }

        /// 10 / 5 = 2 USD/FLT for each CU
        uint256 currentTarget = fltPrice_ / activeUnitCount_;
        uint256 lastRewardPoolValue;
        uint256 lastRewardPoolEpoch;

        RewardPoolPerEpoch storage lastRewardPool = constantsStorage.reward.rewardPoolPerEpoches[length - 1];
        lastRewardPoolEpoch = lastRewardPool.epoch;

        if (currentEpoch_ == lastRewardPool.epoch) {
            if (length < 2) {
                return;
            }

            lastRewardPoolValue = constantsStorage.reward.rewardPoolPerEpoches[length - 2].value;
        } else {
            lastRewardPoolValue = lastRewardPool.value;
        }

        // calculate new reward pool
        uint256 newRewardPool;
        // USD/CU * 1/FLT > USD/CU
        if (currentTarget > constantsStorage.reward.usdTargetRevenuePerEpoch) {
            // if we distribute more tokens than
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
            constantsStorage.reward.rewardPoolPerEpoches[length - 1].value = newRewardPool;
        } else {
            constantsStorage.reward.rewardPoolPerEpoches.push(
                RewardPoolPerEpoch({epoch: currentEpoch_, value: newRewardPool})
            );
        }
    }
    // #endregion ------------------ Internal Mutable Functions ------------------
}
