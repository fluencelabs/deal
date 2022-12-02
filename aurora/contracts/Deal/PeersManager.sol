pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../Core/Core.sol";
import "./DepositManager.sol";
import "./RoleManager.sol";

contract PeersManagerState {
    type PATId is bytes32;
    mapping(address => mapping(PATId => uint256)) public collaterals;
}

abstract contract PeersManager is
    PeersManagerState,
    RoleManager,
    DepositManager
{
    using SafeERC20 for IERC20;

    function registerPeerToken(bytes32 salt) external onlyResourceManager {
        IERC20 token = fluenceToken();
        address addr = msg.sender;
        PATId PATID = PATId.wrap(keccak256(abi.encode(block.number, salt)));

        require(collaterals[addr][PATID] == 0, "Id already used");

        require(
            roles[addr] == Role.ResourceManager,
            "Participant isn't ResourceManager"
        );

        uint256 requiredStake = settings.requiredStake;
        uint256 balance = balances[addr].balanceByToken[token];
        require(
            (balance - requiredStake) >= 0,
            "PeersManager: not enough balance"
        );

        balances[addr].balanceByToken[token] = balance - settings.requiredStake;
        collaterals[addr][PATID] += requiredStake;
    }

    function removePeerToken(PATId id) external onlyResourceManager {
        _removePeerToken(id, msg.sender);
    }

    function slash(
        PATId PDTId,
        address addr,
        AquaProxy.Particle calldata particle
    ) external {
        try aquaProxy().verifyParticle(particle) {
            revert("PeersManager: particle is valid");
        } catch {
            IERC20 token = fluenceToken();

            uint collateralAmount = _removePeerToken(PDTId, addr);
            uint slashAmount = (collateralAmount / 100) * core.slashFactor();

            balances[addr].balanceByToken[token] -= slashAmount;

            //TODO: send to treasury
            token.safeTransfer(address(0x00), slashAmount);
        }
    }

    function _removePeerToken(
        PATId id,
        address addr
    ) private returns (uint256) {
        IERC20 token = fluenceToken();

        uint256 collateral = collaterals[addr][id];
        require(collateral > 0, "");

        balances[addr].balanceByToken[token] += collateral;
        collaterals[addr][id] = 0;

        return collateral;
    }
}
