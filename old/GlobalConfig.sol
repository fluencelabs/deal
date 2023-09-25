// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./DealFactory.sol";
import "./interfaces/IGlobalConfig.sol";
import "./interfaces/IMatcher.sol";
import "./interfaces/IFactory.sol";

abstract contract GlobalConfigState is IGlobalConfig {
    IERC20 public fluenceToken;
    uint public withdrawTimeout;
    uint256 public epochDuration;
    IMatcher public matcher;
    IFactory public factory;
}

contract GlobalCore is OwnableUpgradeable, GlobalConfigState, UUPSUpgradeable {
    constructor() {
        _disableInitializers();
    }

    function currentEpoch() external view returns (uint256) {
        return block.timestamp / epochDuration;
    }

    function initialize(IERC20 fluenceToken_, uint withdrawTimeout_, IEpochManager epochDuration_) public initializer {
        fluenceToken = fluenceToken_;
        withdrawTimeout = withdrawTimeout_;
        epochManager = epochManager_;

        __Ownable_init();
    }

    function owner() public view override(OwnableUpgradeable, IGlobalConfig) returns (address) {
        return OwnableUpgradeable.owner();
    }

    function setFluenceToken(IERC20 fluenceToken_) external onlyOwner {
        fluenceToken = fluenceToken_;
    }

    function setWithdrawTimeout(uint withdrawTimeout_) external onlyOwner {
        withdrawTimeout = withdrawTimeout_;
    }

    function setEpochManager(IEpochManager epochManager_) external onlyOwner {
        epochManager = epochManager_;
    }

    function setMatcher(IMatcher matcher_) external onlyOwner {
        matcher = matcher_;
    }

    function setFactory(IFactory factory_) external onlyOwner {
        factory = factory_;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
