pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../Deal/Deal.sol";

contract DealFactoryState {
    Core public core;
}

contract DealFactorySettings is DealFactoryState {
    modifier onlyCore() {
        require(msg.sender == address(core), "Only core");
        _;
    }

    function setCore(Core core_) public onlyCore {
        core = core_;
    }
}

contract DealFactory is DealFactorySettings {
    event CreateDeal(address addr);

    constructor(Core core_) {
        setCore(core_);
    }

    function createDeal(IERC20 paymentToken) external {
        address addr = address(new Deal(paymentToken, core, msg.sender));

        emit CreateDeal(addr);
    }
}
