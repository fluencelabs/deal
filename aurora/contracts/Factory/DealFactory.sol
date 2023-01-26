pragma solidity ^0.8.17;

import "../Core/Core.sol";
import "../Deal/Deal.sol";

contract DealFactory {
    Core public core;

    event CreateDeal(
        address deal,
        address paymentToken,
        uint256 pricePerEpoch,
        uint256 requiredStake
    );

    constructor(Core core_) {
        core = core_;
    }

    function createDeal(
        bytes32 subnetId,
        address paymentToken,
        uint256 pricePerEpoch,
        uint256 requiredStake
    ) external {
        Deal deal = new Deal(
            core,
            subnetId,
            paymentToken,
            pricePerEpoch,
            requiredStake
        );
        deal.transferOwnership(msg.sender);

        emit CreateDeal(
            address(deal),
            paymentToken,
            pricePerEpoch,
            requiredStake
        );
    }
}
