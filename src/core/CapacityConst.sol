// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import {PRECISION} from "src/utils/Common.sol";
import {ICapacityConst} from "src/core/interfaces/ICapacityConst.sol";
import {CapacityConstStorage, LibCapacityConst, RewardPoolPerEpoch} from "src/lib/LibCapacityConst.sol";
import {LibEpochController} from "src/lib/LibEpochController.sol";
import {LibDiamond} from "src/lib/LibDiamond.sol";
import {EpochController} from "src/core/EpochController.sol";

contract CapacityConst is ICapacityConst, EpochController {
    function fltPrice() external view returns (uint256) {
        return LibCapacityConst.fltPrice();
    }

    function fltCollateralPerUnit() external view returns (uint256) {
        return LibCapacityConst.fltCollateralPerUnit();
    }

    function usdCollateralPerUnit() external view returns (uint256) {
        return LibCapacityConst.usdCollateralPerUnit();
    }

    function usdTargetRevenuePerEpoch() external view returns (uint256) {
        return LibCapacityConst.usdTargetRevenuePerEpoch();
    }

    function minDuration() external view returns (uint256) {
        return LibCapacityConst.minDuration();
    }

    function minRewardPerEpoch() external view returns (uint256) {
        return LibCapacityConst.minRewardPerEpoch();
    }

    function maxRewardPerEpoch() external view returns (uint256) {
        return LibCapacityConst.maxRewardPerEpoch();
    }

    function vestingPeriodDuration() external view returns (uint256) {
        return LibCapacityConst.vestingPeriodDuration();
    }

    function vestingPeriodCount() external view returns (uint256) {
        return LibCapacityConst.vestingPeriodCount();
    }

    function slashingRate() external view returns (uint256) {
        return LibCapacityConst.slashingRate();
    }

    function minProofsPerEpoch() external view returns (uint256) {
        return LibCapacityConst.minProofsPerEpoch();
    }

    function maxProofsPerEpoch() external view returns (uint256) {
        return LibCapacityConst.maxProofsPerEpoch();
    }

    function withdrawEpochsAfterFailed() external view returns (uint256) {
        return LibCapacityConst.withdrawEpochsAfterFailed();
    }

    function maxFailedRatio() external view returns (uint256) {
        return LibCapacityConst.maxFailedRatio();
    }

    function activeUnitCount() external view returns (uint256) {
        return LibCapacityConst.activeUnitCount();
    }

    function difficulty() external view returns (bytes32) {
        return LibCapacityConst.difficulty();
    }

    function randomXProxy() external view returns (address) {
        return LibCapacityConst.randomXProxy();
    }

    function oracle() external view returns (address) {
        return LibCapacityConst.oracle();
    }

    function getRewardPool(uint256 epoch) external view returns (uint256) {
        return LibCapacityConst.getRewardPool(epoch);
    }


    function setFLTPrice(uint256 fltPrice_) external {
        CapacityConstStorage storage constantsStorage = LibCapacityConst.store();
        require(msg.sender == constantsStorage.oracle, "Only oracle can set FLT price");
        constantsStorage.fltPrice = fltPrice_;

        LibCapacityConst._setRewardPool(fltPrice_, constantsStorage.activeUnitCount);
        constantsStorage.commitment.fltCollateralPerUnit =
            LibCapacityConst._calcFLTCollateralPerUnit(constantsStorage.commitment.usdCollateralPerUnit, fltPrice_);

        emit FLTPriceUpdated(fltPrice_);
    }

    function calculateRewardPool() external {
        CapacityConstStorage storage constantsStorage = LibCapacityConst.store();
        LibCapacityConst._setRewardPool(constantsStorage.fltPrice, constantsStorage.activeUnitCount);
    }

    function setDifficulty(bytes32 difficulty_) external {
        LibDiamond.enforceIsContractOwner();
        CapacityConstStorage storage constantsStorage = LibCapacityConst.store();
        constantsStorage.proof.difficulty = constantsStorage.proof.nextDifficulty;
        constantsStorage.proof.nextDifficulty = difficulty_;
        constantsStorage.proof.difficultyChangeEpoch = LibEpochController.currentEpoch() + 1;

        emit DifficultyUpdated(difficulty_);
    }

    function setCapacityConstant(CapacityConstantType constantType, uint256 v) external {
        LibDiamond.enforceIsContractOwner();
        CapacityConstStorage storage constantsStorage = LibCapacityConst.store();

        // capacity section
        if (constantType == CapacityConstantType.MinDuration) {
            constantsStorage.commitment.minDuration = v;
        } else if (constantType == CapacityConstantType.USDCollateralPerUnit) {
            constantsStorage.commitment.usdCollateralPerUnit = v;
            constantsStorage.commitment.fltCollateralPerUnit = LibCapacityConst._calcFLTCollateralPerUnit(v, constantsStorage.fltPrice);
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
            LibCapacityConst._setRewardPool(constantsStorage.fltPrice, constantsStorage.activeUnitCount);
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

    function setOracle(address oracle_) external {
        LibDiamond.enforceIsContractOwner();
        require(oracle_ != address(0), "Oracle shouldn't be zero address");
        CapacityConstStorage storage constantsStorage = LibCapacityConst.store();
        constantsStorage.oracle = oracle_;
        emit OracleSet(oracle_);
    }
}
