pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../Core/AquaProxy.sol";
import "./TestERC20.sol";

contract DeveloperFaucet {
    IERC20 public immutable fluenceToken;
    IERC20 public immutable usdToken;

    constructor() {
        uint v = 0;
        unchecked {
            v--;
        }

        fluenceToken = new TestERC20("Fluence Test Token", "FLT", v);
        usdToken = new TestERC20("USD Test Token", "USD", v);
    }

    function receiveUSD(address addr, uint value) external {
        usdToken.transfer(addr, value);
    }

    function receiveFLT(address addr, uint value) external {
        fluenceToken.transfer(addr, value);
    }
}
