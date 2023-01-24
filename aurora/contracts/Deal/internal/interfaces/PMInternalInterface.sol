pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../external/interfaces/IProviderManager.sol";

abstract contract PMInternalInterface {
    function _getPATOwner(IProviderManager.PATId id)
        internal
        view
        virtual
        returns (address);

    function _getCollateral(IProviderManager.PATId id)
        internal
        view
        virtual
        returns (uint256);

    function _getPATToken(IProviderManager.PATId id)
        internal
        view
        virtual
        returns (IERC20);

    function _addCollateral(
        IProviderManager.PATId id,
        address owner,
        IERC20 token,
        uint256 collateral
    ) internal virtual;

    function _removeCollateral(IProviderManager.PATId id) internal virtual;
}
