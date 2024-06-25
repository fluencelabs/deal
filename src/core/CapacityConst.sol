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

import "src/utils/OwnableUpgradableDiamond.sol";
import {PRECISION} from "src/utils/Common.sol";
import "./interfaces/ICapacityConst.sol";
import "./EpochController.sol";

contract CapacityConst is ICapacityConst, OwnableUpgradableDiamond, EpochController {
    // #region ------------------ Constants ------------------
    uint256 internal constant _REWARD_POOL_SHRINK_RATE = PRECISION / 10 * 9; // 0.9 = 90%
    uint256 internal constant _REWARD_POOL_GROWTH_RATE = PRECISION + PRECISION / 10; // 1.1 = 110%
    // #endregion ------------------ Constants ------------------

    // #region ------------------ Types ------------------
    struct RewardPoolPerEpoch {
        uint256 epoch;
        uint256 value;
    }
    // #endregion ------------------ Types ------------------

    // #region ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.capacity.storage.v1.const")) - 1);

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

    struct ConstStorage {
        uint256 fltPrice;
        address randomXProxy;
        uint256 activeUnitCount;
        CommitmentConst commitment;
        ProofConst proof;
        RewardConst reward;
        address oracle;
    }

    function _getConstStorage() private pure returns (ConstStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }
    // #endregion ------------------ Storage ------------------

    // #region ------------------ Initializer ------------------
    function __CapacityConst_init(CapacityConstInitArgs memory initArgs) internal onlyInitializing {
        ConstStorage storage constantsStorage = _getConstStorage();

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
            RewardPoolPerEpoch({epoch: currentEpoch(), value: initArgs.initRewardPool})
        );

        constantsStorage.fltPrice = initArgs.fltPrice;
        constantsStorage.commitment.fltCollateralPerUnit =
            _calcFLTCollateralPerUnit(initArgs.usdCollateralPerUnit, initArgs.fltPrice);
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

    function minProofsPerEpoch() public view returns (uint256) {
        return _getConstStorage().proof.minProofsPerEpoch;
    }

    function maxProofsPerEpoch() public view returns (uint256) {
        return _getConstStorage().proof.maxProofsPerEpoch;
    }

    function withdrawEpochsAfterFailed() public view returns (uint256) {
        return _getConstStorage().commitment.withdrawEpochsAfterFailed;
    }

    function maxFailedRatio() public view returns (uint256) {
        return _getConstStorage().commitment.maxFailedRatio;
    }

    function activeUnitCount() public view returns (uint256) {
        return _getConstStorage().activeUnitCount;
    }

    function difficulty() public view returns (bytes32) {
        ConstStorage storage constantsStorage = _getConstStorage();
        if (currentEpoch() >= constantsStorage.proof.difficultyChangeEpoch) {
            return constantsStorage.proof.nextDifficulty;
        }

        return _getConstStorage().proof.difficulty;
    }

    function randomXProxy() public view returns (address) {
        return _getConstStorage().randomXProxy;
    }

    function oracle() public view returns (address) {
        return _getConstStorage().oracle;
    }

    function getRewardPool(uint256 epoch) public view returns (uint256) {
        ConstStorage storage constantsStorage = _getConstStorage();

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
    // #endregion ------------------ External View Functions ------------------

    // #region ------------------ External Mutable Functions ------------------
    function setFLTPrice(uint256 fltPrice_) public {
        ConstStorage storage constantsStorage = _getConstStorage();
        require(msg.sender == constantsStorage.oracle, "Only oracle can set FLT price");
        constantsStorage.fltPrice = fltPrice_;

        _setRewardPool(fltPrice_, constantsStorage.activeUnitCount);
        constantsStorage.commitment.fltCollateralPerUnit =
            _calcFLTCollateralPerUnit(constantsStorage.commitment.usdCollateralPerUnit, fltPrice_);

        emit FLTPriceUpdated(fltPrice_);
    }

    function calculateRewardPool() external {
        ConstStorage storage constantsStorage = _getConstStorage();
        _setRewardPool(constantsStorage.fltPrice, constantsStorage.activeUnitCount);
    }

    function setDifficulty(bytes32 difficulty_) external onlyOwner {
        ConstStorage storage constantsStorage = _getConstStorage();
        constantsStorage.proof.difficulty = constantsStorage.proof.nextDifficulty;
        constantsStorage.proof.nextDifficulty = difficulty_;
        constantsStorage.proof.difficultyChangeEpoch = currentEpoch() + 1;

        emit DifficultyUpdated(difficulty_);
    }

    function setCapacityConstant(CapacityConstantType constantType, uint256 v) external onlyOwner {
        ConstStorage storage constantsStorage = _getConstStorage();

        // capacity section
        if (constantType == CapacityConstantType.MinDuration) {
            constantsStorage.commitment.minDuration = v;
        } else if (constantType == CapacityConstantType.USDCollateralPerUnit) {
            constantsStorage.commitment.usdCollateralPerUnit = v;
            constantsStorage.commitment.fltCollateralPerUnit = _calcFLTCollateralPerUnit(v, constantsStorage.fltPrice);
        } else if (constantType == CapacityConstantType.SlashingRate) {
            constantsStorage.commitment.slashingRate = v;
        } else if (constantType == CapacityConstantType.WithdrawEpochsAfterFailed) {
            constantsStorage.commitment.withdrawEpochsAfterFailed = v;
        } else if (constantType == CapacityConstantType.MaxFailedRatio) {
            constantsStorage.commitment.maxFailedRatio = v;
        }
        // reward section
        else if (constantType == CapacityConstantType.USDTargetRevenuePerEpoch) {
            constantsStorage.reward.usdTargetRevenuePerEpoch = v;
            _setRewardPool(constantsStorage.fltPrice, constantsStorage.activeUnitCount);
        } else if (constantType == CapacityConstantType.MinRewardPerEpoch) {
            constantsStorage.reward.minRewardPerEpoch = v;
        } else if (constantType == CapacityConstantType.MaxRewardPerEpoch) {
            constantsStorage.reward.maxRewardPerEpoch = v;
        }
        // proof section
        else if (constantType == CapacityConstantType.MinProofsPerEpoch) {
            constantsStorage.proof.minProofsPerEpoch = v;
        } else if (constantType == CapacityConstantType.MaxProofsPerEpoch) {
            constantsStorage.proof.maxProofsPerEpoch = v;
        } else {
            revert("GlobalConst: unknown constant type");
        }

        emit CapacityConstantUpdated(constantType, v);
    }

    function setOracle(address oracle_) external onlyOwner {
        require(oracle_ != address(0), "Oracle shouldn't be zero address");
        ConstStorage storage constantsStorage = _getConstStorage();
        constantsStorage.oracle = oracle_;
        emit OracleSet(oracle_);
    }
    // #endregion ------------------ External Mutable Functions ------------------

    // #region ------------------ Internal Mutable Functions ------------------
    function _setActiveUnitCount(uint256 activeUnitCount_) internal {
        ConstStorage storage constantsStorage = _getConstStorage();

        constantsStorage.activeUnitCount = activeUnitCount_;
        _setRewardPool(constantsStorage.fltPrice, activeUnitCount_);
    }

    function _calcFLTCollateralPerUnit(uint256 usdCollateralPerUnit_, uint256 fltPrice_)
        internal
        pure
        returns (uint256)
    {
        return usdCollateralPerUnit_ * PRECISION / fltPrice_ * 1e18 / PRECISION;
    }

    function _setRewardPool(uint256 fltPrice_, uint256 activeUnitCount_) internal {
        ConstStorage storage constantsStorage = _getConstStorage();
        uint256 currentEpoch_ = currentEpoch();

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
    // #endregion ------------------ Internal Mutable Functions ------------------
}
