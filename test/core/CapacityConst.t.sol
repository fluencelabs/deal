// // SPDX-License-Identifier: Apache-2.0
// pragma solidity ^0.8.19;

// import {Test, console2} from "forge-std/Test.sol";
// import "forge-std/console.sol";
// import "forge-std/Vm.sol";
// import "forge-std/StdCheats.sol";
// import "filecoin-solidity/v0.8/utils/Actor.sol";
// import "src/core/Core.sol";
// import "src/core/modules/capacity/CapacityConst.sol";
// import "src/core/modules/capacity/interfaces/ICapacityConst.sol";
// import "src/utils/BytesConverter.sol";
// import "test/utils/DeployDealSystem.sol";
// import "src/core/modules/market/Market.sol";
// import "src/core/modules/market/interfaces/IMarket.sol";
// import "test/utils/TestHelper.sol";
// import "forge-std/StdCheats.sol";

// contract CpacityConstTest is Test {
//     using SafeERC20 for IERC20;
//     using BytesConverter for bytes32;

//     // ------------------ Events ------------------

//     // ------------------ Variables ------------------

//     // ------------------ Test ------------------
//     TestCapacityConst capacityConst;
//     address mockedCore = address(0x123);

//     function setUp() public {
//         capacityConst = new TestCapacityConst(ICore(mockedCore));
//     }

//     function test_InitOne() public {
//         uint256 fltPrice = 1 * PRECISION; // 1 FLT = 1 USD
//         uint256 usdCollateralPerUnit = 100 * PRECISION; // 100 USD
//         uint256 usdTargetRevenuePerEpoch = 1000 * PRECISION; // 1000 USD
//     }

//     // ------------------ Internals ------------------
// }

// contract TestCapacityConst is CapacityConst {
//     constructor(ICore core_) CapacityConst(core_) {}

//     function init(
//         uint256 fltPrice_,
//         uint256 usdCollateralPerUnit_,
//         uint256 usdTargetRevenuePerEpoch_,
//         uint256 minDuration_,
//         uint256 minRewardPerEpoch_,
//         uint256 maxRewardPerEpoch_,
//         uint256 vestingPeriodDuration_,
//         uint256 vestingPeriodCount_,
//         uint256 slashingRate_,
//         uint256 minRequierdProofsPerEpoch_,
//         uint256 maxProofsPerEpoch_,
//         uint256 withdrawEpochesAfterFailed_,
//         uint256 maxFailedRatio_,
//         bytes32 difficulty_,
//         uint256 initRewardPool_,
//         address randomXProxy_
//     ) public onlyInitializing {
//         __CapacityConst_init(
//             fltPrice_,
//             usdCollateralPerUnit_,
//             usdTargetRevenuePerEpoch_,
//             minDuration_,
//             minRewardPerEpoch_,
//             maxRewardPerEpoch_,
//             vestingPeriodDuration_,
//             vestingPeriodCount_,
//             slashingRate_,
//             minRequierdProofsPerEpoch_,
//             maxProofsPerEpoch_,
//             withdrawEpochesAfterFailed_,
//             maxFailedRatio_,
//             difficulty_,
//             initRewardPool_,
//             randomXProxy_
//         );
//     }
// }
