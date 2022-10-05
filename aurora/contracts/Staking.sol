pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Staking {
    uint constant SLASH_FACTOR = 100;

    mapping(address => uint) public stakingBalances;
    mapping(address => uint) public lastSlashIds;

    address public daoAddress;
    IERC20 private _fluenceToken;

    //TODO
    /*
    constructor(IERC20 fluenceToken_) {
        _fluenceToken = fluenceToken_;
    }*/

    function stake(uint amount) external {
        stakingBalances[msg.sender] += amount;
        _fluenceToken.transferFrom(msg.sender, address(this), amount);

        _callToNear("add_validator");
    }

    function exit(address account) external {
        require(!isSlashed(account), "Account already slashed");
        if (isSlashed(account)) {
            _slash(account);
        } else {
            _exit(account);
        }
    }

    function _slash(address account) private {
        uint slashAmount = (stakingBalances[account] / 100) * SLASH_FACTOR;

        stakingBalances[account] -= slashAmount;
        _fluenceToken.transferFrom(address(this), daoAddress, slashAmount);

        //TODO: callback to near
        _callToNear("unslash");
    }

    function _exit(address account) private {
        uint256 balance = stakingBalances[account];
        stakingBalances[account] = 0;

        _fluenceToken.transferFrom(address(this), account, balance);

        _callToNear("remove_validator");
    }

    function isSlashed(address account) private view returns (bool) {
        //TODO: call to near
        return false;
    }

    //TODO: callback to near
    function _callToNear(string memory method) internal {}
}
