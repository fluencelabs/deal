pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../internal/interfaces/PMInternalInterface.sol";
import "../internal/interfaces/DCInternalInterface.sol";
import "./interfaces/IProviderManager.sol";

abstract contract ProviderManager is
    IProviderManager,
    PMInternalInterface,
    DCInternalInterface
{
    using SafeERC20 for IERC20;

    function getPATOwner(PATId id) external view returns (address) {
        return _getPATOwner(id);
    }

    function createProviderToken(bytes32 salt) external onlyResourceManager {
        address owner = msg.sender;

        //TODO: owner
        PATId id = PATId.wrap(
            keccak256(abi.encode(address(this), block.number, salt, owner))
        );
        require(
            _getRole(owner) == Role.ResourceManager,
            "Participant isn't ResourceManager"
        );

        _createPAT(id, owner);

        emit AddProviderToken(owner, id);
    }

    function removeProviderToken(PATId id) external onlyResourceManager {
        require(_getPATOwner(id) == msg.sender, "ProviderManager: not owner");
        _removePAT(id);

        emit RemoveProviderToken(id);
    }
}
