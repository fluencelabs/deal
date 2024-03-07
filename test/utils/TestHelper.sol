// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "forge-std/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "./DeployDealSystem.sol";
import "src/dev/TestERC20.sol";
import "src/core/Core.sol";
import "src/deal/Deal.sol";

library TestHelper {
    function pseudoRandom(bytes memory seed) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(blockhash(block.number - 1), seed));
    }

    function generateProviders(uint256 count)
        internal
        view
        returns (address[] memory computeProviders, bytes32[] memory peerIds, bytes32[] memory unitIds)
    {
        computeProviders = new address[](count);
        peerIds = new bytes32[](count);
        unitIds = new bytes32[](count);

        for (uint256 i = 0; i < count; i++) {
            computeProviders[i] = address(bytes20(pseudoRandom(abi.encode("provider", i))));
            peerIds[i] = pseudoRandom(abi.encode("peerId", i));
            unitIds[i] = pseudoRandom(abi.encode("unitId", i));
        }
    }

    function deployDealWithoutFactory(
        DeployDealSystem.Deployment storage deployment,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 pricePerWorkerEpoch_,
        uint256 deposit_
    ) internal returns (Deal) {
        ERC1967Proxy proxy = new ERC1967Proxy(
            address(deployment.dealImpl),
            abi.encodeWithSelector(
                Deal.initialize.selector,
                deployment.core,
                CIDV1({prefixes: 0x12345678, hash: pseudoRandom(abi.encode("appCID", 0))}),
                IERC20(address(deployment.tUSD)),
                minWorkers_,
                targetWorkers_,
                maxWorkersPerProvider_,
                pricePerWorkerEpoch_,
                new CIDV1[](0),
                IConfig.AccessType.NONE,
                new address[](0)
            )
        );

        Deal deal = Deal(address(proxy));

        deployment.tUSD.approve(address(deal), deposit_);
        deal.deposit(deposit_);

        return deal;
    }

    function deployDealWithoutFactory(
        DeployDealSystem.Deployment storage deployment,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 pricePerWorkerEpoch_
    ) internal returns (Deal) {
        uint256 deposit_ = deployment.core.minDealDepositedEpoches() * pricePerWorkerEpoch_ * targetWorkers_;
        return deployDealWithoutFactory(deployment, minWorkers_, targetWorkers_, maxWorkersPerProvider_, pricePerWorkerEpoch_, deposit_);
    }
}
