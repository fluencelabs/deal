pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../external/interfaces/IWorkersManager.sol";

abstract contract IWorkersManagerInternal {
    function _getPATOwner(IWorkersManager.PATId id)
        internal
        view
        virtual
        returns (address);

    function _createPAT(IWorkersManager.PATId id, address owner)
        internal
        virtual;

    function _removePAT(IWorkersManager.PATId id) internal virtual;
}
