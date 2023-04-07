pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Multicall.sol";
import "../Global/AquaProxy.sol";
import "./TestERC20.sol";

contract OwnableFaucet is Ownable {
    IERC20 public immutable fluenceToken;
    IERC20 public immutable usdToken;

    constructor() {
        uint256 v = 0;
        unchecked {
            v--;
        }

        fluenceToken = new TestERC20("Fluence Test Token", "FLT", v);
        usdToken = new TestERC20("USD Test Token", "USD", v);
    }

    function sendUSD(address addr, uint256 value) external onlyOwner {
        usdToken.transfer(addr, value);
    }

    function sendFLT(address addr, uint256 value) external onlyOwner {
        fluenceToken.transfer(addr, value);
    }
}
