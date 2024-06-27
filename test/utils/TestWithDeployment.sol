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
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ICore} from "src/core/interfaces/ICore.sol";
import {ICapacityConst} from "src/core/interfaces/ICapacityConst.sol";
import {IGlobalConst} from "src/core/interfaces/IGlobalConst.sol";
import {IEpochController} from "src/core/interfaces/IEpochController.sol";
import {ICapacity} from "src/core/interfaces/ICapacity.sol";
import {IMarket} from "src/core/interfaces/IMarket.sol";
import {IMatcher} from "src/core/interfaces/IMatcher.sol";
import {IOffer} from "src/core/interfaces/IOffer.sol";
import {IDealFactory} from "src/core/interfaces/IDealFactory.sol";
import {IDeal} from "src/deal/interfaces/IDeal.sol";
import {IDiamondCut} from "src/interfaces/IDiamondCut.sol";
import {IDiamondLoupe} from "src/interfaces/IDiamondLoupe.sol";
import {IDiamond} from "src/interfaces/IDiamond.sol";
import {PRECISION} from "src/utils/Common.sol";


contract TestWithDeployment is Test {
    // ------------------ Types ------------------
    struct Deployment {
        bool initialized;
        IERC20 tUSD;
        IDiamond diamond;
        ICore diamondAsCore;
        IMarket diamondAsMarket;
        ICapacity diamondAsCapacity;
        IDealFactory diamondAsDealFactory;
        IDeal dealImpl;
        ICore coreFacet;
        IMarket marketFacet;
        ICapacity capacityFacet;
        IDealFactory dealFactoryFacet;
        IDiamondCut diamondCutFacet;
        IDiamondLoupe diamondLoupeFacet;
    }

    // ------------------ Constants ------------------
    uint256 public constant DEFAULT_EPOCH_DURATION = 1 days;
    uint256 public constant DEFAULT_FLT_PRICE = 10 * PRECISION; // 10 USD
    uint256 public constant DEFAULT_MIN_DEPOSITED_EPOCHS = 2;
    uint256 public constant DEFAULT_MIN_REMATCHING_EPOCHS = 2;
    uint256 public constant DEFAULT_MIN_PROTOCOL_VERSION = 1;
    uint256 public constant DEFAULT_MAX_PROTOCOL_VERSION = 1;
    uint256 public constant DEFAULT_USD_COLLATERAL_PER_UNIT = 100 * PRECISION; // 100 USD
    uint256 public constant DEFAULT_USD_TARGET_REVENUE_PER_EPOCH = 2000 * PRECISION; // 2000 USD
    uint256 public constant DEFAULT_MIN_DURATION = 1 days;
    uint256 public constant DEFAULT_MIN_REWARD_PER_EPOCH = 10000;
    uint256 public constant DEFAULT_MAX_REWARD_PER_EPOCH = 1;
    uint256 public constant DEFAULT_VESTING_PERIOD_DURATION = 10;
    uint256 public constant DEFAULT_VESTING_PERIOD_COUNT = 6;
    uint256 public constant DEFAULT_SLASHING_RATE = 100000; // 0.01 = 1% = 100000
    uint256 public constant DEFAULT_MIN_REQUIERD_PROOFS_PER_EPOCH = 3;
    uint256 public constant DEFAULT_MAX_PROOFS_PER_EPOCH = 5;
    uint256 public constant DEFAULT_WITHDRAW_EPOCHS_AFTER_FAILED = 2;
    uint256 public constant DEFAULT_MAX_FAILED_RATIO = 10;
    uint256 public constant DEFAULT_INIT_REWARD_POOL = 1000 ether;
    bool public constant DEFAULT_IS_WHITELIST_ENABLED = false;
    bytes32 public constant DEFAULT_DIFFICULTY_TARGET =
        0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    bytes32 public constant DEFAULT_INIT_GLOBAL_NONCE = keccak256("init_global_nonce");
    address public DEFAULT_ORACLE = address(456);

    // ------------------ Variables ------------------
    Deployment public deployment;

    function _deploySystem() internal {
        deployment.tUSD = IERC20(deployCode("out/TestERC20.sol/TestERC20.json", abi.encode("Test USD", "tUSD", 8)));

        IDeal dealImpl = IDeal(deployCode("out/Deal.sol/Deal.json"));
        deployment.dealImpl = dealImpl;

        IDiamondCut diamondCutFacet = IDiamondCut(deployCode("out/DiamondCutFacet.sol/DiamondCutFacet.json"));
        deployment.diamondCutFacet = diamondCutFacet;

        IDiamondLoupe diamondLoupeFacet = IDiamondLoupe(deployCode("out/DiamondLoupeFacet.sol/DiamondLoupeFacet.json"));
        deployment.diamondLoupeFacet = diamondLoupeFacet;


        ICore coreFacet = ICore(deployCode("out/CoreFacet.sol/CoreFacet.json"));
        deployment.coreFacet = coreFacet;

        IMarket marketFacet = IMarket(deployCode("out/MarketFacet.sol/MarketFacet.json"));
        deployment.marketFacet = marketFacet;

        ICapacity capacityFacet = ICapacity(payable(deployCode("out/CapacityFacet.sol/CapacityFacet.json")));
        deployment.capacityFacet = capacityFacet;

        IDealFactory dealFactoryFacet = IDealFactory(deployCode("out/DealFactoryFacet.sol/DealFactoryFacet.json"));
        deployment.dealFactoryFacet = dealFactoryFacet;

        IDiamond.CoreParams memory coreParams = IDiamond.CoreParams({
            epochDuration: DEFAULT_EPOCH_DURATION,
            dealImpl: IDeal(dealImpl),
            isWhitelistEnabled: DEFAULT_IS_WHITELIST_ENABLED,
            capacityConstInitArgs: ICapacityConst.CapacityConstInitArgs({
                fltPrice: DEFAULT_FLT_PRICE,
                usdCollateralPerUnit: DEFAULT_USD_COLLATERAL_PER_UNIT,
                usdTargetRevenuePerEpoch: DEFAULT_USD_TARGET_REVENUE_PER_EPOCH,
                minDuration: DEFAULT_MIN_DURATION,
                slashingRate: DEFAULT_SLASHING_RATE,
                withdrawEpochsAfterFailed: DEFAULT_WITHDRAW_EPOCHS_AFTER_FAILED,
                maxFailedRatio: DEFAULT_MAX_FAILED_RATIO,
                minRewardPerEpoch: DEFAULT_MIN_REWARD_PER_EPOCH,
                maxRewardPerEpoch: DEFAULT_MAX_REWARD_PER_EPOCH,
                vestingPeriodDuration: DEFAULT_VESTING_PERIOD_DURATION,
                vestingPeriodCount: DEFAULT_VESTING_PERIOD_COUNT,
                minProofsPerEpoch: DEFAULT_MIN_REQUIERD_PROOFS_PER_EPOCH,
                maxProofsPerEpoch: DEFAULT_MAX_PROOFS_PER_EPOCH,
                difficulty: DEFAULT_DIFFICULTY_TARGET,
                initRewardPool: DEFAULT_INIT_REWARD_POOL,
                randomXProxy: deployCode("out/RandomXProxyMock.sol/RandomXProxyMock.json", abi.encode(DEFAULT_DIFFICULTY_TARGET)),
                oracle: DEFAULT_ORACLE
            })
        });

        IDiamond.CapacityParams memory capacityParams = IDiamond.CapacityParams({
            initGlobalNonce: DEFAULT_INIT_GLOBAL_NONCE
        });

        IDiamond.GlobalConstParams memory globalConstParams = IDiamond.GlobalConstParams({
            minDealDepositedEpochs: DEFAULT_MIN_DEPOSITED_EPOCHS,
            minDealRematchingEpochs: DEFAULT_MIN_REMATCHING_EPOCHS,
            minProtocolVersion: DEFAULT_MIN_PROTOCOL_VERSION,
            maxProtocolVersion: DEFAULT_MAX_PROTOCOL_VERSION
        });

        address diamond = deployCode(
            "out/Diamond.sol/Diamond.json",
            abi.encode(
                diamondCutFacet,
                coreParams,
                capacityParams,
                globalConstParams
            )
        );

        deployment.diamond = IDiamond(payable(diamond));
        deployment.diamondAsCore = ICore(diamond);
        deployment.diamondAsMarket = IMarket(diamond);
        deployment.diamondAsCapacity = ICapacity(payable(diamond));
        deployment.diamondAsDealFactory = IDealFactory(diamond);

        // do diamondcut
        IDiamondCut.FacetCut[] memory diamondCut = new IDiamondCut.FacetCut[](4);
        bytes4[] memory coreSelectors = new bytes4[](34);
        coreSelectors[0] = ICore.dealImpl.selector;
        coreSelectors[1] = ICore.setActiveUnitCount.selector;
        coreSelectors[2] = ICore.setDealImpl.selector;
        coreSelectors[3] = IGlobalConst.precision.selector;
        coreSelectors[4] = IGlobalConst.minDealDepositedEpochs.selector;
        coreSelectors[5] = IGlobalConst.minDealRematchingEpochs.selector;
        coreSelectors[6] = IGlobalConst.minProtocolVersion.selector;
        coreSelectors[7] = IGlobalConst.maxProtocolVersion.selector;
        coreSelectors[8] = IGlobalConst.setConstant.selector;
        coreSelectors[9] = ICapacityConst.fltPrice.selector;
        coreSelectors[10] = ICapacityConst.fltCollateralPerUnit.selector;
        coreSelectors[11] = ICapacityConst.usdCollateralPerUnit.selector;
        coreSelectors[12] = ICapacityConst.usdTargetRevenuePerEpoch.selector;
        coreSelectors[13] = ICapacityConst.minDuration.selector;
        coreSelectors[14] = ICapacityConst.minRewardPerEpoch.selector;
        coreSelectors[15] = ICapacityConst.maxRewardPerEpoch.selector;
        coreSelectors[16] = ICapacityConst.vestingPeriodDuration.selector;
        coreSelectors[17] = ICapacityConst.vestingPeriodCount.selector;
        coreSelectors[18] = ICapacityConst.slashingRate.selector;
        coreSelectors[19] = ICapacityConst.minProofsPerEpoch.selector;
        coreSelectors[20] = ICapacityConst.maxProofsPerEpoch.selector;
        coreSelectors[21] = ICapacityConst.withdrawEpochsAfterFailed.selector;
        coreSelectors[22] = ICapacityConst.maxFailedRatio.selector;
        coreSelectors[23] = ICapacityConst.activeUnitCount.selector;
        coreSelectors[24] = ICapacityConst.difficulty.selector;
        coreSelectors[25] = ICapacityConst.randomXProxy.selector;
        coreSelectors[26] = ICapacityConst.getRewardPool.selector;
        coreSelectors[27] = ICapacityConst.setFLTPrice.selector;
        coreSelectors[28] = ICapacityConst.setDifficulty.selector;
        coreSelectors[29] = ICapacityConst.setCapacityConstant.selector;
        coreSelectors[30] = ICapacityConst.setOracle.selector;
        coreSelectors[31] = IEpochController.currentEpoch.selector;
        coreSelectors[32] = IEpochController.epochDuration.selector;
        coreSelectors[33] = IEpochController.initTimestamp.selector;

        bytes4[] memory marketSelectors = new bytes4[](22);
        marketSelectors[0] = IMatcher.matchDeal.selector;
        marketSelectors[1] = IOffer.getProviderInfo.selector;
        marketSelectors[2] = IOffer.getOffer.selector;
        marketSelectors[3] = IOffer.getComputePeer.selector;
        marketSelectors[4] = IOffer.getComputeUnit.selector;
        marketSelectors[5] = IOffer.getComputeUnitIds.selector;
        marketSelectors[6] = IOffer.getComputeUnits.selector;
        marketSelectors[7] = IOffer.getEffectorInfo.selector;
        marketSelectors[8] = IOffer.setProviderInfo.selector;
        marketSelectors[9] = IOffer.registerMarketOffer.selector;
        marketSelectors[10] = IOffer.removeOffer.selector;
        marketSelectors[11] = IOffer.addComputePeers.selector;
        marketSelectors[12] = IOffer.removeComputePeer.selector;
        marketSelectors[13] = IOffer.addComputeUnits.selector;
        marketSelectors[14] = IOffer.removeComputeUnit.selector;
        marketSelectors[15] = IOffer.changeMinPricePerWorkerEpoch.selector;
        marketSelectors[16] = IOffer.changePaymentToken.selector;
        marketSelectors[17] = IOffer.addEffector.selector;
        marketSelectors[18] = IOffer.removeEffector.selector;
        marketSelectors[19] = IOffer.returnComputeUnitFromDeal.selector;
        marketSelectors[20] = IOffer.setEffectorInfo.selector;
        marketSelectors[21] = IOffer.removeEffectorInfo.selector;

        bytes4[] memory capacitySelectors = new bytes4[](13);
        capacitySelectors[0] = ICapacity.getStatus.selector;
        capacitySelectors[1] = ICapacity.getCommitment.selector;
        capacitySelectors[2] = ICapacity.totalRewards.selector;
        capacitySelectors[3] = ICapacity.unlockedRewards.selector;
        capacitySelectors[4] = ICapacity.getGlobalNonce.selector;
        capacitySelectors[5] = ICapacity.createCommitment.selector;
        capacitySelectors[6] = ICapacity.removeCommitment.selector;
        capacitySelectors[7] = ICapacity.finishCommitment.selector;
        capacitySelectors[8] = ICapacity.depositCollateral.selector;
        capacitySelectors[9] = ICapacity.submitProofs.selector;
        capacitySelectors[10] = ICapacity.submitProof.selector;
        capacitySelectors[11] = ICapacity.removeCUFromCC.selector;
        capacitySelectors[12] = ICapacity.withdrawReward.selector;

        bytes4[] memory dealFactorySelectors = new bytes4[](2);
        dealFactorySelectors[0] = IDealFactory.hasDeal.selector;
        dealFactorySelectors[1] = IDealFactory.deployDeal.selector;


        diamondCut[0] = IDiamondCut.FacetCut({
            facetAddress: address(coreFacet),
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: coreSelectors
        });
        diamondCut[1] = IDiamondCut.FacetCut({
            facetAddress: address(deployment.marketFacet),
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: marketSelectors
        });
        diamondCut[2] = IDiamondCut.FacetCut({
            facetAddress: address(deployment.capacityFacet),
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: capacitySelectors
        });
        diamondCut[3] = IDiamondCut.FacetCut({
            facetAddress: address(deployment.dealFactoryFacet),
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: dealFactorySelectors
        });
        // diamondCut[4] = IDiamondCut.FacetCut({
        //     facetAddress: address(diamondLoupeFacet),
        //     action: IDiamondCut.FacetCutAction.Add,
        //     functionSelectors: new bytes4[](0)
        // });

        IDiamondCut(diamond).diamondCut(diamondCut, address(0), new bytes(0));


        deployment.initialized = true;
    }
}
