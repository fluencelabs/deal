pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../AquaProxy.sol";
import "../Core.sol";

contract DealConfigState {
    IERC20 public immutable paymentToken;

    constructor(IERC20 paymentToken_) {
        paymentToken = paymentToken_;
    }

    Core public core;
    bytes32 public airScriptHash;
}

contract DealConfig is DealConfigState, Ownable {
    using SafeERC20 for IERC20;

    constructor(
        IERC20 paymentToken_,
        bytes32 airScriptHash_,
        Core core_,
        address owner_
    ) DealConfigState(paymentToken_) {
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
