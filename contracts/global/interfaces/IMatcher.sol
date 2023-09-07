// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "../../deal/interfaces/ICore.sol";
import "../../deal/base/Types.sol";

interface IMatcher {
    function findComputePeers(
        uint requiredCollateral,
        uint pricePerEpoch,
        uint freeWorkerSlots,
        CIDV1[] calldata effectors
    ) external view returns (address[] memory computeProviders, bytes32[][] memory computePeers);

    // ----------------- Mutable -----------------

    // extra bad solution - temp solution
    function matchDeal(ICore deal, address[] calldata providers, bytes32[][] calldata peers) external;
}
