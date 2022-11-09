pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./AquaProxy.sol";
import "./Deal/Deal.sol";

contract DealFactory {
    //TODO: add editable params
    Core public immutable core;

    event CreateDeal(address addr);

    constructor(Core core_) {
        core = core_;
    }

    function createDeal(IERC20 paymentToken, bytes32 airScriptHash) external {
        address addr = address(
            new Deal(paymentToken, airScriptHash, core, msg.sender)
        );

        emit CreateDeal(addr);
    }
}
