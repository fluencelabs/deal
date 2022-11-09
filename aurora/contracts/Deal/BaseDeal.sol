pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../AquaProxy.sol";
import "../Core.sol";

contract BaseDeal is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable paymentToken;

    Core public core;
    bytes32 public airScriptHash;

    constructor(
        IERC20 paymentToken_,
        bytes32 airScriptHash_,
        Core core_,
        address owner_
    ) {
        paymentToken = paymentToken_;
        airScriptHash = airScriptHash_;
        core = core_;

        transferOwnership(owner_);
    }

    function fluenceToken() public view returns (IERC20) {
        return core.fluenceToken();
    }

    function aquaProxy() public view returns (AquaProxy) {
        return core.aquaProxy();
    }
}
