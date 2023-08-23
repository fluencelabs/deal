// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IEpochManager.sol";
import "./IMatcher.sol";
import "./IFactory.sol";

interface IGlobalConfig {
    function owner() external view returns (address);

    function fluenceToken() external view returns (IERC20);

    function withdrawTimeout() external view returns (uint);

    function epochManager() external view returns (IEpochManager);

    function matcher() external view returns (IMatcher);

    function factory() external view returns (IFactory);
}
