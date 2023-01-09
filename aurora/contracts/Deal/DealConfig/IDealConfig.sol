pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../Core/Core.sol";

interface IDealConfig {
    struct Settings {
        IERC20 paymentToken;
        uint256 pricePerEpoch;
        uint256 requiredStake;
    }

    function fluenceToken() external view returns (IERC20);

    function aquaProxy() external view returns (AquaProxy);

    function subnetId() external view returns (bytes32);

    function settings() external view returns (Settings memory);
}
