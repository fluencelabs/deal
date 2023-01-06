pragma solidity ^0.8.17;

import "../Core/Core.sol";
import "../Deal/DealConfig/DealConfig.sol";
import "../Deal/Deal.sol";

contract DealFactory {
    Core public core;

    event CreateDeal(address deal, DealConfig.Settings settings);

    constructor(Core core_) {
        core = core_;
    }

    function createDeal(
        bytes32 subnetId,
        DealConfig.Settings memory settings
    ) external {
        Deal deal = new Deal(core, subnetId, settings);
        emit CreateDeal(address(deal), settings);
    }
}
