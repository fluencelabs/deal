// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../deal/interfaces/IDeal.sol";

interface IMatcher {
    // ----------------- Events -----------------
    event ComputePeerMatched(bytes32 indexed peerId, IDeal deal, bytes32 computeUnitId, uint dealCreationBlock, CIDV1 appCID);

    // ----------------- View -----------------
    // TODO: move this logic to offchain. Temp solution
    function findComputePeers(IDeal deal) external view returns (address[] memory computeProviders, bytes32[][] memory computePeers);

    // ----------------- Mutables -----------------
    function matchDeal(IDeal deal, address[] calldata providers, bytes32[][] calldata peers) external;
}
