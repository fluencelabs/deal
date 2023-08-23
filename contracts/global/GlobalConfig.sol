// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./DealFactory.sol";
import "./interfaces/IGlobalConfig.sol";
import "./interfaces/IMatcher.sol";
import "./interfaces/IFactory.sol";
import "./interfaces/IEpochManager.sol";

abstract contract GlobalConfigState is IGlobalConfig {
    IERC20 public fluenceToken;
    uint public withdrawTimeout;
    IEpochManager public epochManager;
    IMatcher public matcher;
    IFactory public factory;
}

contract GlobalConfig is OwnableUpgradeable, GlobalConfigState, UUPSUpgradeable {
    constructor() {
        _disableInitializers();
    }

    function initialize(IERC20 fluenceToken_, uint withdrawTimeout_, IEpochManager epochManager_) public initializer {
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
