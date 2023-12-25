// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "src/deal/interfaces/IDeal.sol";

interface IMatcher {
    // ------------------ Errors ------------------
    error minWorkersNotMatched(uint _minWorkers);
    // ----------------- Mutables -----------------
    function matchDeal(IDeal deal, bytes32[] calldata computeUnits) external;
}
