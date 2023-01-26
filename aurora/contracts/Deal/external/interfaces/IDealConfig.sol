pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../../Core/Core.sol";

interface IDealConfig {
    function subnetId() external view returns (bytes32);

    function requiredStake() external view returns (uint256);
}
