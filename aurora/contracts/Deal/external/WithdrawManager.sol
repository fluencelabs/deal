pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IWithdrawCollateralManager.sol";
import "../internal/interfaces/WMInternalInterface.sol";
import "../internal/interfaces/DCInternalInterface.sol";

abstract contract WithdrawManager is
    WMInternalInterface,
    DCInternalInterface,
    IWithdrawCollateralManager
{
    function getUnlockedCollateralBy(address owner, uint256 timestamp)
        external
        view
        returns (uint256)
    {
        return _getUnlockedAmountBy(_fluenceToken(), owner, timestamp);
    }

    function withdraw(IERC20 token) external {
        _withdraw(token, msg.sender);
    }
}
