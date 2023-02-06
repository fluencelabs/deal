pragma solidity ^0.8.17;

import "../Core/Core.sol";
import "../Deal/Deal.sol";

contract DealFactory {
    Core public core;

    event DealCreated(
        address deal,
        address paymentToken,
        uint256 pricePerEpoch,
        uint256 requiredStake,
        uint256 minWorkers,
        uint256 maxWorkersPerProvider,
        uint256 targetWorkers,
        bytes32 appCID,
        bytes32[] effectorWasmsCIDs,
        uint256 epoch
    );

    constructor(Core core_) {
        core = core_;
    }

    function createDeal(
        address paymentToken_,
        uint256 pricePerEpoch_,
        uint256 requiredStake_,
        uint256 minWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 targetWorkers_,
        bytes32 appCID_,
        bytes32[] memory effectorWasmsCIDs_
    ) external {
        Deal deal = new Deal(
            core,
            paymentToken_,
            pricePerEpoch_,
            requiredStake_,
            minWorkers_,
            maxWorkersPerProvider_,
            targetWorkers_,
            appCID_,
            effectorWasmsCIDs_
        );

        deal.transferOwnership(msg.sender);

        emit DealCreated(
            address(deal),
            address(paymentToken_),
            pricePerEpoch_,
            requiredStake_,
            minWorkers_,
            maxWorkersPerProvider_,
            targetWorkers_,
            appCID_,
            effectorWasmsCIDs_,
            core.epochManager().getEpoch()
        );
    }
}
