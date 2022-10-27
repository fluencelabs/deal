pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./AquaProxy.sol";
import "./Deal.sol";

contract DealFactory {
    //TODO: add editable params
    address public immutable daoAddress;
    AquaProxy public immutable aquaProxy;
    IERC20 public immutable fluenceToken;

    event CreateDeal(address addr);

    constructor(
        address daoAddress_,
        AquaProxy aquaProxy_,
        IERC20 fluenceToken_
    ) {
        daoAddress = daoAddress_;
        aquaProxy = aquaProxy_;
        fluenceToken = fluenceToken_;
    }

    function createDeal(IERC20 paymentToken, bytes32 airScriptHash) external {
        address addr = address(
            new Deal(
                paymentToken,
                daoAddress,
                aquaProxy,
                fluenceToken,
                airScriptHash
            )
        );

        emit CreateDeal(addr);
    }
}
