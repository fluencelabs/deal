pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../external/interfaces/IProviderManager.sol";

abstract contract WMInternalInterface {
    function _getUnlockedAmountBy(
        IERC20 token,
        address owner,
        uint256 timestamp
    ) internal view virtual returns (uint256);

    function _createWithdrawRequest(
        IERC20 token,
        address owner,
        uint256 amount
    ) internal virtual;

    function _withdraw(IERC20 token, address owner) internal virtual;
}
