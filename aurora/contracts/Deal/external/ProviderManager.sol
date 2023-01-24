pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../internal/interfaces/PMInternalInterface.sol";
import "../internal/interfaces/DCInternalInterface.sol";
import "../internal/interfaces/RMInternalInterface.sol";
import "../internal/interfaces/BMInternalInterface.sol";
import "./interfaces/IProviderManager.sol";

abstract contract ProviderManager is
    BMInternalInterface,
    PMInternalInterface,
    DCInternalInterface,
    RMInternalInterface,
    IProviderManager
{
    using SafeERC20 for IERC20;

    function getPATOwner(PATId id) external view returns (address) {
        return _getPATOwner(id);
    }

    function createProviderToken(bytes32 salt) external onlyResourceManager {
        IERC20 token = _core().fluenceToken();
        address owner = msg.sender;

        //TODO: owner
        PATId id = PATId.wrap(keccak256(abi.encode(block.number, salt, owner)));
        require(_getPATOwner(id) == address(0x00), "Id already used");
        require(
            _getRole(owner) == Role.ResourceManager,
            "Participant isn't ResourceManager"
        );

        _addCollateral(id, owner, token, _requiredStake());

        emit AddProviderToken(owner, id);
    }

    function removeProviderToken(PATId id) external onlyResourceManager {
        require(_getPATOwner(id) == msg.sender, "ProviderManager: not owner");
        _removeCollateral(id);

        emit RemoveProviderToken(id);
    }

    function slash(PATId id, AquaProxy.Particle calldata particle) external {
        try _core().aquaProxy().verifyParticle(particle) {
            revert("ProviderManager: particle is valid");
        } catch {
            address owner = _getPATOwner(id);
            uint256 collateral = _getCollateral(id);
            IERC20 token = _getPATToken(id);

            _removeCollateral(id);

            uint256 slashAmount = (collateral / 100) * _core().slashFactor();

            //TODO: send to treasury
            address treasury = address(0x00);
            _transferBalance(
                token,
                owner,
                treasury,
                uint256(PATId.unwrap(id)),
                0,
                slashAmount
            );
            _instantWithdraw(token, treasury, 0, slashAmount);
        }
    }
}
