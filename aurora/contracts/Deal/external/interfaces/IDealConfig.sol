pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../../Core/Core.sol";

interface IDealConfig {
    function core() external view returns (Core);

    function requiredStake() external view returns (uint256);

    function paymentToken() external view returns (IERC20);

    function pricePerEpoch() external view returns (uint256);

    function fluenceToken() external view returns (IERC20);

    function appCID() external view returns (string memory);

    function effectorWasmsCids() external view returns (string[] memory);

    function minWorkers() external view returns (uint256);

    function maxWorkers() external view returns (uint256);

    function targetWorkers() external view returns (uint256);
}
