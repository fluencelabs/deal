pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./AquaProxy.sol";

contract Deal {
    using SafeERC20 for IERC20;

    struct Validator {
        uint balance;
        bool isActive;
    }

    uint public constant WITHDRAW_TIMEOUT = 1 minutes;
    uint public constant MIN_STAKE = 10 * 10**18;
    uint constant SLASH_FACTOR = 100;

    IERC20 public immutable paymentToken;
    address public immutable daoAddress;
    AquaProxy public immutable aquaProxy;
    IERC20 public immutable fluenceToken;

    bool public isStopped;
    uint public withdrawUnlockTime;
    bytes32 public airScriptHash;
    mapping(address => Validator) public validators;

    mapping(uint256 => uint256) private paymentsBitMap;

    constructor(
        IERC20 paymentToken_,
        address daoAddress_,
        AquaProxy aquaProxy_,
        IERC20 fluenceToken_,
        bytes32 airScriptHash_
    ) {
        daoAddress = daoAddress_;
        aquaProxy = aquaProxy_;
        fluenceToken = fluenceToken_;

        paymentToken = paymentToken_;
        airScriptHash = airScriptHash_;
    }

    function deposit(uint amount) external {
        require(block.timestamp > withdrawUnlockTime, "Deposit is locked");

        if (!isStopped) {
            isStopped = true;
        }

        paymentToken.safeTransferFrom(msg.sender, address(this), amount);
    }

    function createWithdrawRequest() external {
        isStopped = true;
        withdrawUnlockTime = block.timestamp + WITHDRAW_TIMEOUT;
    }

    function withdraw() external {
        require(
            isStopped && block.timestamp > withdrawUnlockTime,
            "Withdraw request is not created or not expired delay"
        );

        uint balance = paymentToken.balanceOf(address(this));
        paymentToken.safeTransfer(msg.sender, balance);
    }

    function submitGoldenParticle(AquaProxy.Particle calldata particle)
        external
    {
        //verify
        //spend
    }

    function stake(uint amount) external {
        require(amount >= MIN_STAKE, "Amount is too small");

        Validator memory validator = validators[msg.sender];

        validator.balance += amount;
        if (!validator.isActive) {
            validator.isActive = true;
        }

        validators[msg.sender] = validator;

        fluenceToken.transferFrom(msg.sender, address(this), amount);
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
            aquaProxy.particlesStatuses(particleHash) ==
                AquaProxy.ParticleStatus.Failure,
            "Particle is not failed"
        );

        _slash(account);
    }

    function _slash(address account) private {
        Validator memory validator = validators[account];

        uint slashAmount = (validator.balance / 100) * SLASH_FACTOR;

        validator.balance -= slashAmount;

        validators[account] = validator;
        fluenceToken.transferFrom(address(this), daoAddress, slashAmount);
    }

    function _exit(address account) private {
        Validator memory validator = validators[account];

        uint balance = validator.balance;
        validator.balance = 0;

        validators[account] = validator;
        fluenceToken.transferFrom(address(this), daoAddress, balance);
    }
}
