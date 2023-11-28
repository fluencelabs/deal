// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "src/utils/OwnableUpgradableDiamond.sol";
import "./interfaces/IGlobalConst.sol";
import "./EpochController.sol";

contract GlobalConst is EpochController, OwnableUpgradableDiamond, IGlobalConst {
    // ------------------ Events ------------------
    event ConstantsUpdated(Constant constantType, uint256 value);

    // ------------------ Constants ------------------
    uint256 public constant PRECISION = 10000; // min: 0.0001

    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.core.storage.v1.globalConst")) - 1);

    struct GlobalConstStorage {
        address fluenceToken;
        uint256 minDepositedEpoches;
        uint256 minRematchingEpoches;
        uint256 collateralPerUnit;
        uint256 minCapacityCommitmentDuration;
        uint256 fltPrice;
        uint256 minCapacityRewardPerEpoch;
        uint256 maxCapacityRewardPerEpoch;
        uint256 targetRevenuePerEpoch;
        uint256 vestingDuration;
        uint256 slashingRate;
        uint256 minRequierdCCProofs;
        uint256 maxCCProofs;
        uint256 withdrawCCEpochesAfterFailed;
        uint256 maxFailedRatio;
    }

    GlobalConstStorage private _storage;

    function _getGlobalConstStorage() private pure returns (GlobalConstStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ------------------ Initializer ------------------
    function __GlobalConst_init(address fluenceToken_, uint256 minDepositedEpoches_, uint256 minRematchingEpoches_)
        internal
        onlyInitializing
    {
        GlobalConstStorage storage globalConstantsStorage = _getGlobalConstStorage();

        globalConstantsStorage.fluenceToken = fluenceToken_;
        globalConstantsStorage.minDepositedEpoches = minDepositedEpoches_;
        globalConstantsStorage.minRematchingEpoches = minRematchingEpoches_;
    }

    // ------------------ External View Functions ------------------
    function fluenceToken() public view returns (address) {
        return _getGlobalConstStorage().fluenceToken;
    }

    function minDepositedEpoches() public view returns (uint256) {
        return _getGlobalConstStorage().minDepositedEpoches;
    }

    function minRematchingEpoches() public view returns (uint256) {
        return _getGlobalConstStorage().minRematchingEpoches;
    }

    function collateralPerUnit() public view returns (uint256) {
        return _getGlobalConstStorage().collateralPerUnit;
    }

    function minCapacityCommitmentDuration() public view returns (uint256) {
        return _getGlobalConstStorage().minCapacityCommitmentDuration;
    }

    function fltPrice() public view returns (uint256) {
        return _getGlobalConstStorage().fltPrice;
    }

    function minCapacityRewardPerEpoch() public view returns (uint256) {
        return _getGlobalConstStorage().minCapacityRewardPerEpoch;
    }

    function maxCapacityRewardPerEpoch() public view returns (uint256) {
        return _getGlobalConstStorage().maxCapacityRewardPerEpoch;
    }

    function targetRevenuePerEpoch() public view returns (uint256) {
        return _getGlobalConstStorage().targetRevenuePerEpoch;
    }

    function vestingDuration() public view returns (uint256) {
        return _getGlobalConstStorage().vestingDuration;
    }

    function slashingRate() public view returns (uint256) {
        return _getGlobalConstStorage().slashingRate;
    }

    function maxFailedRatio() public view returns (uint256) {
        return _getGlobalConstStorage().maxFailedRatio;
    }

    function minRequierdCCProofs() public view returns (uint256) {
        return _getGlobalConstStorage().minRequierdCCProofs;
    }

    function maxCCProofs() public view returns (uint256) {
        return _getGlobalConstStorage().maxCCProofs;
    }

    function withdrawCCEpochesAfterFailed() public view returns (uint256) {
        return _getGlobalConstStorage().withdrawCCEpochesAfterFailed;
    }

    // ------------------ External Mutable Functions ------------------
    function setConstant(Constant constantType, uint256 v) external onlyOwner {
        GlobalConstStorage storage s = _getGlobalConstStorage();

        if (constantType == Constant.MinDepositedEpoches) {
            s.minDepositedEpoches = v;
        } else if (constantType == Constant.MinRematchingEpoches) {
            s.minRematchingEpoches = v;
        } else if (constantType == Constant.CollateralPerUnit) {
            s.collateralPerUnit = v;
        } else if (constantType == Constant.MinCapacityCommitmentDuration) {
            s.minCapacityCommitmentDuration = v;
        } else if (constantType == Constant.FLTPrice) {
            s.fltPrice = v;
        } else if (constantType == Constant.MinCapacityRewardPerEpoch) {
            s.minCapacityRewardPerEpoch = v;
        } else if (constantType == Constant.MaxCapacityRewardPerEpoch) {
            s.maxCapacityRewardPerEpoch = v;
        } else if (constantType == Constant.TargetRevenuePerEpoch) {
            s.targetRevenuePerEpoch = v;
        } else if (constantType == Constant.VestingDuration) {
            require(s.vestingDuration == 0, "GlobalConst: vesting duration already set");
            s.vestingDuration = v;
        } else if (constantType == Constant.SlashingRate) {
            s.slashingRate = v;
        } else if (constantType == Constant.MaxFailedRatio) {
            s.maxFailedRatio = v;
        } else if (constantType == Constant.MinRequierdCCProofs) {
            s.minRequierdCCProofs = v;
        } else if (constantType == Constant.MaxCCProofs) {
            s.maxCCProofs = v;
        } else if (constantType == Constant.WithdrawCCTimeoutAfterFailed) {
            s.withdrawCCEpochesAfterFailed = v;
        } else {
            revert("GlobalConst: unknown constant type");
        }

        emit ConstantsUpdated(constantType, v);
    }
}
