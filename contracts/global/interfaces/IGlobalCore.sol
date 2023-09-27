// SPDX-License-Identifier: Apache-2.0

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IDealFactory.sol";
import "../matcher/interfaces/IMatcher.sol";

pragma solidity ^0.8.19;

interface IGlobalCore {
    // ------------------ Events ------------------
    event MatcherSet(address matcher);
    event FactorySet(address factory);

    // ------------------ Initializer ------------------
    function initialize(IERC20 fluenceToken_, uint256 epochDuration_) external;

    // ------------------ external View Functions ------------------
    function currentEpoch() external view returns (uint256);

    function epochDuration() external view returns (uint256);

    function fluenceToken() external view returns (IERC20);

    function matcher() external view returns (IMatcher);

    function factory() external view returns (IDealFactory);

    // ------------------ external Mutable Functions ------------------
    function setMatcher(IMatcher matcher_) external;

    function setFactory(IDealFactory factory_) external;
}
