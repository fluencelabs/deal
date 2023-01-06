pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../DealConfig/DealConfigInternal.sol";
import "../DepositManager/DepositManagerInternal.sol";
import "./ProviderManagerInternal.sol";
import "./IProviderManager.sol";
import "../RoleManager/RMInternalInterface.sol";

abstract contract ProviderManager is
    ProviderManagerInternal,
    DCInternalInterface,
    RMInternalInterface,
    IProviderManager
{
    using SafeERC20 for IERC20;

    function addProviderToken(bytes32 salt) external onlyResourceManager {
        IERC20 token = _dealConfigState().core.fluenceToken();
        address addr = msg.sender;

        //TODO: owner
        PATId id = PATId.wrap(keccak256(abi.encode(block.number, salt, addr)));
        PAT memory pat = _getPAT(id);

        require(pat.owner == address(0x00), "Id already used");
        require(
            _getRole(addr) == Role.ResourceManager,
            "Participant isn't ResourceManager"
        );

        uint256 requiredStake = _dealConfigState().settings.requiredStake;
        _addCollateral(id, pat, token, requiredStake);

        emit AddProviderToken(addr, id);
    }

    function removeProviderToken(PATId id) external onlyResourceManager {
        IERC20 token = _dealConfigState().core.fluenceToken();

        PAT memory pat = _getPAT(id);
        require(pat.owner == msg.sender, "ProviderManager: not owner");
        _removeCollateral(id, pat, token);
    }

    function slash(
        PATId id,
        address addr,
        AquaProxy.Particle calldata particle
    ) external {
        try _dealConfigState().core.aquaProxy().verifyParticle(particle) {
            revert("ProviderManager: particle is valid");
        } catch {
            IERC20 token = _dealConfigState().core.fluenceToken();
            PAT memory pat = _getPAT(id);

            _removeCollateral(id, pat, token);

            uint slashAmount = (pat.collateral / 100) *
                _dealConfigState().core.slashFactor();
            _subBalance(token, slashAmount, addr);

            //TODO: send to treasury
            token.safeTransfer(address(0x00), slashAmount);
        }
    }
}
