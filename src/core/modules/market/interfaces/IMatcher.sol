// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "src/deal/interfaces/IDeal.sol";

interface IMatcher {
    // ------------------ Errors ------------------
    error MinWorkersNotMatched(uint256 _minWorkers);

    // ----------------- Events -----------------
    event ComputeUnitMatched(
        bytes32 indexed peerId, IDeal deal, bytes32 unitId, uint256 dealCreationBlock, CIDV1 appCID
    );

    // ----------------- Mutables -----------------
    function matchDeal(IDeal deal, bytes32[] calldata offers, bytes32[][] calldata computeUnits) external;
}
