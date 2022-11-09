pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./IPeerManager.sol";
import "./BaseDeal.sol";
import "../AquaProxy.sol";

contract PeersManager is IPeerManager, BaseDeal {
    using SafeERC20 for IERC20;

    uint public constant STAKE_AMOUNT = 10 * 10**18;
    uint constant SLASH_FACTOR = 100;
    uint public constant EXIT_TIMEOUT = 1 minutes;

    mapping(address => Validator) public validators; //TODO: mv interface or not?

    constructor(
        IERC20 paymentToken_,
        bytes32 airScriptHash_,
        Core core_,
        address owner_
    ) BaseDeal(paymentToken_, airScriptHash_, core_, owner_) {}

    function stake() external {
        Validator storage validator = validators[msg.sender];

        require(
            validator.balance == 0 && validator.status == Status.Inactive,
            "Already staked"
        );

        validator.balance = STAKE_AMOUNT;
        validator.status == Status.Active;

        fluenceToken().transferFrom(msg.sender, address(this), STAKE_AMOUNT);
    }

    function createExitRequest() external {
        Validator storage validator = validators[msg.sender];

        require(validator.status == Status.Active, "Not active");

        validator.status == Status.Exit;
        validator.lastExitRqTime = block.timestamp;
    }

    function exit() external {
        Validator storage validator = validators[msg.sender];

        require(validator.status == Status.Exit, "Not in exit mode");

        require(
            validator.lastExitRqTime + EXIT_TIMEOUT > block.timestamp,
            "Wait exit timeout"
        );

        uint256 balance = validator.balance;

        validator.status == Status.Inactive;
        validator.balance = 0;

        fluenceToken().transferFrom(address(this), msg.sender, balance);
    }

    function claimReward(AquaProxy.Particle calldata particle) external {
        //verify
        //spend
    }

    function slash(AquaProxy.Particle calldata particle, address account)
        external
    {
        require(
            keccak256(abi.encodePacked(particle.air)) == airScriptHash,
            "Invalid script in particle"
        );

        bytes32 particleHash = keccak256(
            abi.encodePacked(
                particle.air,
                particle.prevData,
                particle.params,
                particle.callResults
            )
        );

        require(
            aquaProxy().particlesStatuses(particleHash) ==
                AquaProxy.ParticleStatus.Failure,
            "Particle is not failed"
        );

        Validator memory validator = validators[account];
        uint slashAmount = (validator.balance / 100) * SLASH_FACTOR;

        validator.balance -= slashAmount;

        validators[account] = validator;
        fluenceToken().transferFrom(address(this), owner(), slashAmount);
    }
}
