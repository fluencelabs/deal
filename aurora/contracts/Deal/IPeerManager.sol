pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../AquaProxy.sol";

interface IPeerManager {
    enum Status {
        Inactive,
        Active,
        Exit
    }
    struct Validator {
        uint balance;
        Status status;
        uint lastExitRqTime;
    }

    function stake() external;

    function createExitRequest() external;

    function exit() external;

    function slash(AquaProxy.Particle calldata particle, address account)
        external;

    function claimReward(AquaProxy.Particle calldata particle, address account)
        external;
}
