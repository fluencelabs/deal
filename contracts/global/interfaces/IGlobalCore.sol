// SPDX-License-Identifier: Apache-2.0

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

pragma solidity ^0.8.19;

interface IGlobalCore {
    function fluenceToken() external view returns (IERC20);

    function epochDuration() external view returns (uint256);

    function currentEpoch() external view returns (uint256);

    function setFluenceToken(IERC20 fluenceToken_) external;

    function setWithdrawTimeout(uint withdrawTimeout_) external;
}
