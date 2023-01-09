pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./IProviderManager.sol";

abstract contract PMInternalInterface {
    function _getPATOwner(
        IProviderManager.PATId id
    ) internal view virtual returns (address);

    function _getCollateral(
        IProviderManager.PATId id
    ) internal view virtual returns (uint);

    function _addCollateral(
        IProviderManager.PATId id,
        address owner,
        IERC20 token,
        uint256 collateral
    ) internal virtual;

    function _removeCollateral(
        IProviderManager.PATId id,
        IERC20 token
    ) internal virtual;
}
