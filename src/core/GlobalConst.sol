// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "src/utils/OwnableUpgradableDiamond.sol";
import "./interfaces/IGlobalConst.sol";
import "./EpochController.sol";

contract GlobalConst is EpochController, OwnableUpgradableDiamond, IGlobalConst {
    // ------------------ Constants ------------------
    uint256 public constant PRECISION = 10000000; // min: 0.0000001

    uint256 internal constant _REWARD_POOL_GROWTH_RATE = 9000000; // 90%
    uint256 internal constant _REWARD_POOL_SHRINK_RATE = 11000000; // 110%

    // ------------------ Types ------------------
    struct DealConst {
        uint256 minDepositedEpoches;
        uint256 minRematchingEpoches;
    }

    struct CCConst {
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
    }

    struct RewardPoolPerEpoch {
        uint256 epoch;
        uint256 value;
    }

    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.core.storage.v1.globalConst")) - 1);

    struct GlobalConstStorage {
        address fluenceToken;
        uint256 fltPrice;
        DealConst dealConst;
        CCConst ccConst;
        RewardPoolPerEpoch[] rewardPoolPerEpoches;
    }

    GlobalConstStorage private _storage;

    function _getGlobalConstStorage() private pure returns (GlobalConstStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ------------------ Initializer ------------------
    function __GlobalConst_init(
        address fluenceToken_,
        uint256 fltPrice_,
        uint256 minDepositedEpoches_,
        uint256 minRematchingEpoches_,
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
        GlobalConstStorage storage globalConstantsStorage = _getGlobalConstStorage();

        globalConstantsStorage.fluenceToken = fluenceToken_;
        globalConstantsStorage.dealConst.minDepositedEpoches = minDepositedEpoches_;
        globalConstantsStorage.dealConst.minRematchingEpoches = minRematchingEpoches_;
        globalConstantsStorage.ccConst.usdCollateralPerUnit = usdCollateralPerUnit_;
        globalConstantsStorage.ccConst.usdTargetRevenuePerEpoch = usdTargetRevenuePerEpoch_;
        globalConstantsStorage.ccConst.minDuration = minDuration_;
        globalConstantsStorage.ccConst.minRewardPerEpoch = minRewardPerEpoch_;
        globalConstantsStorage.ccConst.maxRewardPerEpoch = maxRewardPerEpoch_;
        globalConstantsStorage.ccConst.vestingDuration = vestingDuration_;
        globalConstantsStorage.ccConst.slashingRate = slashingRate_;
        globalConstantsStorage.ccConst.minRequierdProofsPerEpoch = minRequierdProofsPerEpoch_;
        globalConstantsStorage.ccConst.maxProofsPerEpoch = maxProofsPerEpoch_;
        globalConstantsStorage.ccConst.withdrawEpochesAfterFailed = withdrawEpochesAfterFailed_;
        globalConstantsStorage.ccConst.maxFailedRatio = maxFailedRatio_;

        setFLTPrice(fltPrice_);
    }

    // ------------------ Internal Mutable Functions ------------------
    function _setRewardPool(uint256 fltPrice_, uint256 activeUnitCount_) internal {
        GlobalConstStorage storage globalConstantsStorage = _getGlobalConstStorage();

        uint256 currentEpoch_ = currentEpoch();
        uint256 currentTarget = 0;

        if (activeUnitCount_ > 0) {
            currentTarget = fltPrice_ / activeUnitCount_;
        }

        // load last reward pool
        uint256 length = globalConstantsStorage.rewardPoolPerEpoches.length;
        uint256 lastRewardPoolValue;
        uint256 lastRewardPoolEpoch;

        if (length > 0) {
            RewardPoolPerEpoch storage lastRewardPool = globalConstantsStorage.rewardPoolPerEpoches[length - 1];
            lastRewardPoolEpoch = lastRewardPool.epoch;

            if (length < 2) {
                lastRewardPoolValue = 0;
            } else if (currentEpoch_ == lastRewardPool.epoch) {
                lastRewardPoolValue = globalConstantsStorage.rewardPoolPerEpoches[length - 2].value;
            } else {
                lastRewardPoolValue = lastRewardPool.value;
            }
        }

        // calculate new reward pool
        uint256 newRewardPool;
        if (currentTarget > globalConstantsStorage.ccConst.usdTargetRevenuePerEpoch) {
            uint256 minRewardPerEpoch = globalConstantsStorage.ccConst.minRewardPerEpoch;
            newRewardPool = lastRewardPoolValue * _REWARD_POOL_SHRINK_RATE / PRECISION;
            if (newRewardPool < minRewardPerEpoch) {
                newRewardPool = minRewardPerEpoch;
            }
        } else {
            uint256 maxRewardPerEpoch = globalConstantsStorage.ccConst.maxRewardPerEpoch;
            newRewardPool = lastRewardPoolValue * _REWARD_POOL_GROWTH_RATE / PRECISION;
            if (newRewardPool > maxRewardPerEpoch) {
                newRewardPool = maxRewardPerEpoch;
            }
        }

        // save new reward pool
        if (currentEpoch_ == lastRewardPoolEpoch) {
            globalConstantsStorage.rewardPoolPerEpoches[length - 1].value = newRewardPool;
        } else {
            globalConstantsStorage.rewardPoolPerEpoches.push(
                RewardPoolPerEpoch({epoch: currentEpoch_, value: newRewardPool})
            );
        }
    }

    function _setCCActiveUnitCount(uint256 activeUnitCount_) internal {
        GlobalConstStorage storage globalConstantsStorage = _getGlobalConstStorage();

        globalConstantsStorage.ccConst.activeUnitCount = activeUnitCount_;
        _setRewardPool(globalConstantsStorage.fltPrice, activeUnitCount_);
    }

    // ------------------ External View Functions ------------------
    // global constants
    function fluenceToken() public view returns (address) {
        return _getGlobalConstStorage().fluenceToken;
    }

    function fltPrice() public view override returns (uint256) {
        return _getGlobalConstStorage().fltPrice;
    }

    // deal constants
    function minDealDepositedEpoches() public view override returns (uint256) {
        return _getGlobalConstStorage().dealConst.minDepositedEpoches;
    }

    function minDealRematchingEpoches() public view override returns (uint256) {
        return _getGlobalConstStorage().dealConst.minRematchingEpoches;
    }

    // cc constants
    function fltCCCollateralPerUnit() public view override returns (uint256) {
        return _getGlobalConstStorage().ccConst.fltCollateralPerUnit;
    }

    function usdCCCollateralPerUnit() public view override returns (uint256) {
        return _getGlobalConstStorage().ccConst.usdCollateralPerUnit;
    }

    function fltCCTargetRevenuePerEpoch() public view override returns (uint256) {
        return _getGlobalConstStorage().ccConst.fltTargetRevenuePerEpoch;
    }

    function usdCCTargetRevenuePerEpoch() public view override returns (uint256) {
        return _getGlobalConstStorage().ccConst.usdTargetRevenuePerEpoch;
    }

    function minCCDuration() public view override returns (uint256) {
        return _getGlobalConstStorage().ccConst.minDuration;
    }

    function minCCRewardPerEpoch() public view override returns (uint256) {
        return _getGlobalConstStorage().ccConst.minRewardPerEpoch;
    }

    function maxCCRewardPerEpoch() public view override returns (uint256) {
        return _getGlobalConstStorage().ccConst.maxRewardPerEpoch;
    }

    function ccVestingDuration() public view override returns (uint256) {
        return _getGlobalConstStorage().ccConst.vestingDuration;
    }

    function ccSlashingRate() public view override returns (uint256) {
        return _getGlobalConstStorage().ccConst.slashingRate;
    }

    function minCCRequierdProofsPerEpoch() public view override returns (uint256) {
        return _getGlobalConstStorage().ccConst.minRequierdProofsPerEpoch;
    }

    function maxCCProofsPerEpoch() public view override returns (uint256) {
        return _getGlobalConstStorage().ccConst.maxProofsPerEpoch;
    }

    function ccWithdrawEpochesAfterFailed() public view override returns (uint256) {
        return _getGlobalConstStorage().ccConst.withdrawEpochesAfterFailed;
    }

    function ccMaxFailedRatio() public view override returns (uint256) {
        return _getGlobalConstStorage().ccConst.maxFailedRatio;
    }

    function ccActiveUnitCount() public view override returns (uint256) {
        return _getGlobalConstStorage().ccConst.activeUnitCount;
    }

    function getCCRewardPool(uint256 epoch) public view override returns (uint256) {
        GlobalConstStorage storage globalConstantsStorage = _getGlobalConstStorage();

        uint256 length = globalConstantsStorage.rewardPoolPerEpoches.length;
        uint256 low = 0;
        uint256 high = length - 1;

        uint256 value = 0;
        while (low <= high) {
            uint256 mid = (low + high) / 2;
            RewardPoolPerEpoch storage rewardPool = globalConstantsStorage.rewardPoolPerEpoches[mid];
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

    // ------------------ External Mutable Functions ------------------
    function setFLTPrice(uint256 fltPrice_) public onlyOwner {
        GlobalConstStorage storage globalConstantsStorage = _getGlobalConstStorage();
        globalConstantsStorage.fltPrice = fltPrice_;

        _setRewardPool(fltPrice_, globalConstantsStorage.ccConst.activeUnitCount);

        globalConstantsStorage.ccConst.fltTargetRevenuePerEpoch =
            globalConstantsStorage.ccConst.usdTargetRevenuePerEpoch / fltPrice_;
        globalConstantsStorage.ccConst.fltCollateralPerUnit =
            globalConstantsStorage.ccConst.usdCollateralPerUnit / fltPrice_;

        emit FLTPriceUpdated(fltPrice_);
    }

    function setDealConstant(DealConstantType constantType, uint256 v) external onlyOwner {
        GlobalConstStorage storage globalConstantsStorage = _getGlobalConstStorage();

        if (constantType == DealConstantType.MinDepositedEpoches) {
            globalConstantsStorage.dealConst.minDepositedEpoches = v;
        } else if (constantType == DealConstantType.MinRematchingEpoches) {
            globalConstantsStorage.dealConst.minRematchingEpoches = v;
        } else {
            revert("GlobalConst: unknown constant type");
        }

        emit DealConstantUpdated(constantType, v);
    }

    function setCCConstant(CCConstantType constantType, uint256 v) external onlyOwner {
        GlobalConstStorage storage globalConstantsStorage = _getGlobalConstStorage();

        if (constantType == CCConstantType.USDCollateralPerUnit) {
            globalConstantsStorage.ccConst.usdCollateralPerUnit = v;
            globalConstantsStorage.ccConst.fltCollateralPerUnit = v / globalConstantsStorage.fltPrice;
        } else if (constantType == CCConstantType.USDTargetRevenuePerEpoch) {
            globalConstantsStorage.ccConst.usdTargetRevenuePerEpoch = v;
            globalConstantsStorage.ccConst.fltTargetRevenuePerEpoch = v / globalConstantsStorage.fltPrice;
        } else if (constantType == CCConstantType.MinDuration) {
            globalConstantsStorage.ccConst.minDuration = v;
        } else if (constantType == CCConstantType.MinRewardPerEpoch) {
            globalConstantsStorage.ccConst.minRewardPerEpoch = v;
        } else if (constantType == CCConstantType.MaxRewardPerEpoch) {
            globalConstantsStorage.ccConst.maxRewardPerEpoch = v;
        } else if (constantType == CCConstantType.VestingDuration) {
            globalConstantsStorage.ccConst.vestingDuration = v;
        } else if (constantType == CCConstantType.SlashingRate) {
            globalConstantsStorage.ccConst.slashingRate = v;
        } else if (constantType == CCConstantType.MinRequierdProofsPerEpoch) {
            globalConstantsStorage.ccConst.minRequierdProofsPerEpoch = v;
        } else if (constantType == CCConstantType.MaxProofsPerEpoch) {
            globalConstantsStorage.ccConst.maxProofsPerEpoch = v;
        } else if (constantType == CCConstantType.WithdrawEpochesAfterFailed) {
            globalConstantsStorage.ccConst.withdrawEpochesAfterFailed = v;
        } else if (constantType == CCConstantType.MaxFailedRatio) {
            globalConstantsStorage.ccConst.maxFailedRatio = v;
        } else {
            revert("GlobalConst: unknown constant type");
        }

        emit CCConstantUpdated(constantType, v);
    }
}
