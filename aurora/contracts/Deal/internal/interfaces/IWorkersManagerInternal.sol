pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../external/interfaces/IWorkersManager.sol";
import { PATId, PAT } from "../Types.sol";

abstract contract IWorkersManagerInternal {
    function _getPAT(PATId id) internal view virtual returns (PAT storage pat);

    function _getNextWorkerIndex() internal view virtual returns (uint256);
}

abstract contract IWorkersManagerMutableInternal {
    function _createPAT(PATId id, address owner, uint index) internal virtual;

    function _removePAT(PATId id) internal virtual;
}
