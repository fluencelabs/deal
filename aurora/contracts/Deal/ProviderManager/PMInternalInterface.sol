pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./IProviderManager.sol";
import "../DepositManager/DMInternalInterface.sol";

abstract contract PMInternalInterface {
    function _getPAT(
        IProviderManager.PATId id
    ) internal view virtual returns (IProviderManager.PAT memory);

    function _addCollateral(
        IProviderManager.PATId id,
        IProviderManager.PAT memory pat,
        IERC20 token,
        uint256 stake
    ) internal virtual;

    function _removeCollateral(
        IProviderManager.PATId id,
        IProviderManager.PAT memory pat,
        IERC20 token
    ) internal virtual;
}
