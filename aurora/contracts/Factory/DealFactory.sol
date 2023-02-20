pragma solidity ^0.8.17;

import "../Core/Core.sol";
import "../Deal/Deal.sol";

contract DealFactory {
    Core public core;
    address public defaultPaymentToken;

    event DealCreated(
        address deal,
        address paymentToken,
        uint256 pricePerEpoch,
        uint256 requiredStake,
        uint256 minWorkers,
        uint256 maxWorkersPerProvider,
        uint256 targetWorkers,
        string appCID,
        string[] effectorWasmsCids,
        uint256 epoch
    );

    constructor(Core core_, address defaultPaymentToken_) {
        core = core_;
        defaultPaymentToken = defaultPaymentToken_;
    }

    function createDeal(
        uint256 minWorkers_,
        uint256 targetWorkers_,
        string memory appCID_
    ) external {
        //TODO: args varables
        uint256 pricePerEpoch_ = 1 * 10**18;
        uint256 requiredStake_ = 1 * 10**18;
        uint256 maxWorkersPerProvider_ = 10000000;
        address paymentToken_ = defaultPaymentToken;

        string[] memory effectorWasmsCids_ = new string[](0);

        // TODO: create2 function
        Deal deal = new Deal(
            core,
            paymentToken_,
            pricePerEpoch_,
            requiredStake_,
            minWorkers_,
            maxWorkersPerProvider_,
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
            maxWorkersPerProvider_,
            targetWorkers_,
            appCID_,
            effectorWasmsCids_,
            core.epochManager().currentEpoch()
        );
    }
}
