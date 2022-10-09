pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./AquaProxy.sol";

contract Staking {
    struct Validator {
        uint balance;
        bool isActive;
    }

    uint public constant MIN_STAKE = 1000;
    uint constant SLASH_FACTOR = 100;

    mapping(address => Validator) public validators;

    address public immutable daoAddress;
    AquaProxy public immutable aquaProxy;
    IERC20 public immutable fluenceToken;

    constructor(
        address daoAddress_,
        AquaProxy aquaProxy_,
        IERC20 fluenceToken_
    ) {
        daoAddress = daoAddress_;
        aquaProxy = aquaProxy_;
        fluenceToken = fluenceToken_;
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

    function exit(AquaProxy.Particle calldata particle, address account)
        external
    {
        bool isValid = aquaProxy.isValidScript(particle);

        if (isValid) {
            _exit(account);
        } else {
            _slash(account);
        }
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
