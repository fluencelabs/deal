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
        uint256 maxWorkers,
        uint256 targetWorkers,
        string appCID,
        string[] effectorWasmsCids
    );

    constructor(Core core_) {
        core = core_;
    }

    function createDeal(
        address paymentToken_,
        uint256 pricePerEpoch_,
        uint256 requiredStake_,
        uint256 minWorkers_,
        uint256 maxWorkers_,
        uint256 targetWorkers_,
        string memory appCID_,
        string[] memory effectorWasmsCids_
    ) external {
        Deal deal = new Deal(
            core,
            paymentToken_,
            pricePerEpoch_,
            requiredStake_,
            minWorkers_,
            maxWorkers_,
            targetWorkers_,
            appCID_,
            effectorWasmsCids_
        );

        deal.transferOwnership(msg.sender);

        emit DealCreated(
            address(deal),
            address(paymentToken_),
            pricePerEpoch_,
            requiredStake_,
            minWorkers_,
            maxWorkers_,
            targetWorkers_,
            appCID_,
            effectorWasmsCids_
        );
    }
}
