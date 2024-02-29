// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "./TestHelper.sol";
import "./DeployDealSystem.sol";

library DealHelper {
    struct DealParams {
        CIDV1 appCID;
        IERC20 paymentToken;
        uint256 minWorkers;
        uint256 targetWorkers;
        uint256 maxWorkersPerProvider;
        uint256 pricePerWorkerEpoch;
        CIDV1[] effectors;
        uint256 protocolVersion;
    }

    // ------------------ Variables ------------------
    function deployDeal(
        DeployDealSystem.Deployment storage deployment,
        uint256 minWorkers,
        uint256 maxWorkersPerProvider,
        uint256 targetWorkers,
        uint256 pricePerWorkerEpoch,
        uint256 depositAmount,
        uint256 protocolVersion
    ) internal returns (IDeal, DealParams memory) {
        CIDV1[] memory effectors = new CIDV1[](10);
        for (uint256 i = 0; i < 10; i++) {
            effectors[i] = CIDV1({prefixes: 0x12345678, hash: TestHelper.pseudoRandom(abi.encode("effector", i))});
        }

        CIDV1 memory appCID = CIDV1({prefixes: 0x12345678, hash: TestHelper.pseudoRandom(abi.encode("appCID", 0))});
        IERC20 paymentToken = IERC20(address(deployment.tUSD));

        IDeal deal = deployment.dealFactory.deployDeal(
            appCID,
            paymentToken,
            depositAmount,
            minWorkers,
            targetWorkers,
            maxWorkersPerProvider,
            pricePerWorkerEpoch,
            effectors,
            IConfig.AccessType.NONE,
            new address[](0),
            protocolVersion
        );

        console.log("Deal deployed");

        return (
            deal,
            DealParams({
                appCID: appCID,
                paymentToken: paymentToken,
                minWorkers: minWorkers,
                targetWorkers: targetWorkers,
                maxWorkersPerProvider: maxWorkersPerProvider,
                pricePerWorkerEpoch: pricePerWorkerEpoch,
                effectors: effectors,
                protocolVersion: protocolVersion
            })
        );
    }
}
