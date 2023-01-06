pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../Utils/WithdrawRequests.sol";
import "../../Core/Core.sol";
import "../DealConfig/DealConfig.sol";
import "./IDepositManager.sol";

abstract contract DMInternalInterface {
    function _addBalance(
        IERC20 token,
        uint amount,
        address addr
    ) internal virtual;

    function _subBalance(
        IERC20 token,
        uint amount,
        address addr
    ) internal virtual;

    function _createWithdrawRequest(
        IERC20 token,
        uint amount,
        address addr
    ) internal virtual;

    function _cancelWithdrawRequest(
        IERC20 token,
        uint timestamp,
        address addr
    ) internal virtual returns (uint);

    function _removeFirstRequest(
        IERC20 token,
        address addr
    ) internal virtual returns (uint);
}
