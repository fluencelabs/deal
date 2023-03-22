// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../internal/interfaces/IWorkersManagerInternal.sol";
import "../internal/interfaces/IDealConfigInternal.sol";
import "./interfaces/IWorkersManager.sol";

abstract contract WorkersManager is IWorkersManager, IDealConfigInternal, IWorkersManagerInternal, IWorkersManagerMutableInternal {
    using SafeERC20 for IERC20;

    function getPATOwner(PATId id) external view returns (address) {
        return _getPATOwner(id);
    }

    function createProviderToken(bytes32 salt, uint index) external {
        address owner = msg.sender;

        //TODO: owner
        PATId id = PATId.wrap(keccak256(abi.encode(address(this), block.number, salt, owner)));

        _createPAT(id, owner, index);

        emit AddProviderToken(owner, id);
    }

    function removeProviderToken(PATId id) external {
        require(_getPATOwner(id) == msg.sender, "WorkersManager: not owner");
        _removePAT(id);

        emit RemoveProviderToken(id);
    }
}
