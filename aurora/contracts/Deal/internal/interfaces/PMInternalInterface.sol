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

    function _createPAT(IProviderManager.PATId id, address owner)
        internal
        virtual;

    function _removePAT(IProviderManager.PATId id) internal virtual;
}
