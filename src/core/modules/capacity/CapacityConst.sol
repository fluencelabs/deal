// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "src/utils/OwnableUpgradableDiamond.sol";
import "src/core/modules/BaseModule.sol";
import {PRECISION, GlobalConst} from "src/core/GlobalConst.sol";
import "./interfaces/ICapacityConst.sol";

contract CapacityConst is BaseModule, OwnableUpgradableDiamond, ICapacityConst {
    // #region ------------------ Constants ------------------
    uint256 internal constant _REWARD_POOL_GROWTH_RATE = 9000000; // 90%
    uint256 internal constant _REWARD_POOL_SHRINK_RATE = 11000000; // 110%
    // #endregion ------------------ Constants ------------------

    // #region ------------------ Types ------------------
    struct RewardPoolPerEpoch {
        uint256 epoch;
        uint256 value;
    }
    // #endregion ------------------ Types ------------------

    // #region ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.capacity.storage.v1.const")) - 1);

    struct ConstStorage {
        uint256 fltPrice;
        uint256 fltCollateralPerUnit;
        uint256 usdCollateralPerUnit;
        uint256 fltTargetRevenuePerEpoch;
        uint256 usdTargetRevenuePerEpoch;
        uint256 minDuration;
        uint256 minRewardPerEpoch;
        uint256 maxRewardPerEpoch;
        uint256 vestingDuration;
        uint256 slashingRate;
        uint256 minRequierdProofsPerEpoch;
        uint256 maxProofsPerEpoch;
        uint256 withdrawEpochesAfterFailed;
        uint256 maxFailedRatio;
        uint256 activeUnitCount;
        RewardPoolPerEpoch[] rewardPoolPerEpoches;
    }

    ConstStorage private _storage;

    function _getConstStorage() private pure returns (ConstStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }
    // #endregion ------------------ Storage ------------------

    // #region ------------------ Initializer ------------------
    constructor(IERC20 fluenceToken_, ICore core_) BaseModule(fluenceToken_, core_) {}

    function __CapacityConst_init(
        uint256 fltPrice_,
        uint256 usdCollateralPerUnit_,
        uint256 usdTargetRevenuePerEpoch_,
        uint256 minDuration_,
        uint256 minRewardPerEpoch_,
        uint256 maxRewardPerEpoch_,
        uint256 vestingDuration_,
        uint256 slashingRate_,
        uint256 minRequierdProofsPerEpoch_,
        uint256 maxProofsPerEpoch_,
        uint256 withdrawEpochesAfterFailed_,
        uint256 maxFailedRatio_
    ) internal onlyInitializing {
        ConstStorage storage constantsStorage = _getConstStorage();

        constantsStorage.usdCollateralPerUnit = usdCollateralPerUnit_;
        constantsStorage.usdTargetRevenuePerEpoch = usdTargetRevenuePerEpoch_;
        constantsStorage.minDuration = minDuration_;
        constantsStorage.minRewardPerEpoch = minRewardPerEpoch_;
        constantsStorage.maxRewardPerEpoch = maxRewardPerEpoch_;
        constantsStorage.vestingDuration = vestingDuration_;
        constantsStorage.slashingRate = slashingRate_;
        constantsStorage.minRequierdProofsPerEpoch = minRequierdProofsPerEpoch_;
        constantsStorage.maxProofsPerEpoch = maxProofsPerEpoch_;
        constantsStorage.withdrawEpochesAfterFailed = withdrawEpochesAfterFailed_;
        constantsStorage.maxFailedRatio = maxFailedRatio_;

        setFLTPrice(fltPrice_);
    }
    // #endregion ------------------ Initializer ------------------

    // #region ------------------ External View Functions ------------------
    function fltPrice() public view returns (uint256) {
        return _getConstStorage().fltPrice;
    }

    function fltCollateralPerUnit() public view returns (uint256) {
        return _getConstStorage().fltCollateralPerUnit;
    }

    function usdCollateralPerUnit() public view returns (uint256) {
        return _getConstStorage().usdCollateralPerUnit;
    }

    function fltTargetRevenuePerEpoch() public view returns (uint256) {
        return _getConstStorage().fltTargetRevenuePerEpoch;
    }

    function usdTargetRevenuePerEpoch() public view returns (uint256) {
        return _getConstStorage().usdTargetRevenuePerEpoch;
    }

    function minDuration() public view returns (uint256) {
        return _getConstStorage().minDuration;
    }

    function minRewardPerEpoch() public view returns (uint256) {
        return _getConstStorage().minRewardPerEpoch;
    }

    function maxRewardPerEpoch() public view returns (uint256) {
        return _getConstStorage().maxRewardPerEpoch;
    }

    function vestingDuration() public view returns (uint256) {
        return _getConstStorage().vestingDuration;
    }

    function slashingRate() public view returns (uint256) {
        return _getConstStorage().slashingRate;
    }

    function minRequierdProofsPerEpoch() public view returns (uint256) {
        return _getConstStorage().minRequierdProofsPerEpoch;
    }

    function maxProofsPerEpoch() public view returns (uint256) {
        return _getConstStorage().maxProofsPerEpoch;
    }

    function withdrawEpochesAfterFailed() public view returns (uint256) {
        return _getConstStorage().withdrawEpochesAfterFailed;
    }

    function maxFailedRatio() public view returns (uint256) {
        return _getConstStorage().maxFailedRatio;
    }

    function activeUnitCount() public view returns (uint256) {
        return _getConstStorage().activeUnitCount;
    }

    function getRewardPool(uint256 epoch) public view returns (uint256) {
        ConstStorage storage constantsStorage = _getConstStorage();

        uint256 length = constantsStorage.rewardPoolPerEpoches.length;
        uint256 low = 0;
        uint256 high = length - 1;

        uint256 value = 0;
        while (low <= high) {
            uint256 mid = (low + high) / 2;
            RewardPoolPerEpoch storage rewardPool = constantsStorage.rewardPoolPerEpoches[mid];
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
    function setFLTPrice(uint256 fltPrice_) public onlyOwner {
        ConstStorage storage constantsStorage = _getConstStorage();
        constantsStorage.fltPrice = fltPrice_;

        _setRewardPool(fltPrice_, constantsStorage.activeUnitCount);

        constantsStorage.fltTargetRevenuePerEpoch = constantsStorage.usdTargetRevenuePerEpoch / fltPrice_;
        constantsStorage.fltCollateralPerUnit = constantsStorage.usdCollateralPerUnit / fltPrice_;

        emit FLTPriceUpdated(fltPrice_);
    }

    function setConstant(ConstantType constantType, uint256 v) external onlyOwner {
        ConstStorage storage constantsStorage = _getConstStorage();

        if (constantType == ConstantType.USDCollateralPerUnit) {
            constantsStorage.usdCollateralPerUnit = v;
            constantsStorage.fltCollateralPerUnit = v / constantsStorage.fltPrice;
        } else if (constantType == ConstantType.USDTargetRevenuePerEpoch) {
            constantsStorage.usdTargetRevenuePerEpoch = v;
            constantsStorage.fltTargetRevenuePerEpoch = v / constantsStorage.fltPrice;
        } else if (constantType == ConstantType.MinDuration) {
            constantsStorage.minDuration = v;
        } else if (constantType == ConstantType.MinRewardPerEpoch) {
            constantsStorage.minRewardPerEpoch = v;
        } else if (constantType == ConstantType.MaxRewardPerEpoch) {
            constantsStorage.maxRewardPerEpoch = v;
        } else if (constantType == ConstantType.VestingDuration) {
            constantsStorage.vestingDuration = v;
        } else if (constantType == ConstantType.SlashingRate) {
            constantsStorage.slashingRate = v;
        } else if (constantType == ConstantType.MinRequierdProofsPerEpoch) {
            constantsStorage.minRequierdProofsPerEpoch = v;
        } else if (constantType == ConstantType.MaxProofsPerEpoch) {
            constantsStorage.maxProofsPerEpoch = v;
        } else if (constantType == ConstantType.WithdrawEpochesAfterFailed) {
            constantsStorage.withdrawEpochesAfterFailed = v;
        } else if (constantType == ConstantType.MaxFailedRatio) {
            constantsStorage.maxFailedRatio = v;
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

    function _setRewardPool(uint256 fltPrice_, uint256 activeUnitCount_) internal {
        ConstStorage storage constantsStorage = _getConstStorage();

        uint256 currentEpoch_ = core.currentEpoch();
        uint256 currentTarget = 0;

        if (activeUnitCount_ > 0) {
            currentTarget = fltPrice_ / activeUnitCount_;
        }

        // load last reward pool
        uint256 length = constantsStorage.rewardPoolPerEpoches.length;
        uint256 lastRewardPoolValue;
        uint256 lastRewardPoolEpoch;

        if (length > 0) {
            RewardPoolPerEpoch storage lastRewardPool = constantsStorage.rewardPoolPerEpoches[length - 1];
            lastRewardPoolEpoch = lastRewardPool.epoch;

            if (length < 2) {
                lastRewardPoolValue = 0;
            } else if (currentEpoch_ == lastRewardPool.epoch) {
                lastRewardPoolValue = constantsStorage.rewardPoolPerEpoches[length - 2].value;
            } else {
                lastRewardPoolValue = lastRewardPool.value;
            }
        }

        // calculate new reward pool
        uint256 newRewardPool;
        if (currentTarget > constantsStorage.usdTargetRevenuePerEpoch) {
            uint256 minRewardPerEpoch_ = constantsStorage.minRewardPerEpoch;
            newRewardPool = lastRewardPoolValue * _REWARD_POOL_SHRINK_RATE / PRECISION;
            if (newRewardPool < minRewardPerEpoch_) {
                newRewardPool = minRewardPerEpoch_;
            }
        } else {
            uint256 maxRewardPerEpoch_ = constantsStorage.maxRewardPerEpoch;
            newRewardPool = lastRewardPoolValue * _REWARD_POOL_GROWTH_RATE / PRECISION;
            if (newRewardPool > maxRewardPerEpoch_) {
                newRewardPool = maxRewardPerEpoch_;
            }
        }

        // save new reward pool
        if (currentEpoch_ == lastRewardPoolEpoch) {
            constantsStorage.rewardPoolPerEpoches[length - 1].value = newRewardPool;
        } else {
            constantsStorage.rewardPoolPerEpoches.push(RewardPoolPerEpoch({epoch: currentEpoch_, value: newRewardPool}));
        }
    }
    // #endregion ------------------ Internal Mutable Functions ------------------
}
