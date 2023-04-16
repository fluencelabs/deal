pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "../auroraSDK/AuroraSdk.sol";
import "./AquaProxy.sol";
import "./EpochManager.sol";

contract GlobalConfigState {
    IERC20 public fluenceToken;
    AquaProxy public aquaProxy;
    uint public withdrawTimeout;
    uint public epochDelayForReward;
    uint public minAmountOfEpochsForReward;
    uint public slashFactor;
    uint public updateSettingsTimeout;
    EpochManager public epochManager;
}

contract GlobalConfig is OwnableUpgradeable, GlobalConfigState, UUPSUpgradeable {
    function initialize(
        IERC20 fluenceToken_,
        AquaProxy aquaProxy_,
        uint withdrawTimeout_,
        uint epochDelayForReward_,
        uint slashFactor_,
        uint updateSettingsTimeout_,
        EpochManager epochManager_
    ) public initializer {
        fluenceToken = fluenceToken_;
        aquaProxy = aquaProxy_;
        withdrawTimeout = withdrawTimeout_;
        epochDelayForReward = epochDelayForReward_;
        slashFactor = slashFactor_;
        updateSettingsTimeout = updateSettingsTimeout_;
        epochManager = epochManager_;

        __Ownable_init();
    }

    function setFluenceToken(IERC20 fluenceToken_) external onlyOwner {
        fluenceToken = fluenceToken_;
    }

    function setAquaProxy(AquaProxy aquaProxy_) external onlyOwner {
        aquaProxy = aquaProxy_;
    }

    function setWithdrawTimeout(uint withdrawTimeout_) external onlyOwner {
        withdrawTimeout = withdrawTimeout_;
    }

    function setEpochDelayForReward(uint epochDelayForReward_) external onlyOwner {
        epochDelayForReward = epochDelayForReward_;
    }

    function setMinAmountOfEpochsForReward(uint minAmountOfEpochsForReward_) external onlyOwner {
        minAmountOfEpochsForReward = minAmountOfEpochsForReward_;
    }

    function setSlashFactor(uint slashFactor_) external onlyOwner {
        slashFactor = slashFactor_;
    }

    function setUpdateSettingsTimeout(uint updateSettingsTimeout_) external onlyOwner {
        updateSettingsTimeout = updateSettingsTimeout_;
    }

    function setEpochManager(EpochManager epochManager_) external onlyOwner {
        epochManager = epochManager_;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
