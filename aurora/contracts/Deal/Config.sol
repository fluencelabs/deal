// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../ParticleVerifyer/IParticleVerifyer.sol";
import "../Global/GlobalConfig.sol";
import "./base/ModuleBase.sol";
import "./interfaces/IConfig.sol";

abstract contract ConfigState is IConfig {
    GlobalConfig public immutable globalConfig;
    IERC20 public immutable fluenceToken;
    IParticleVerifyer public immutable particleVerifyer;

    constructor(GlobalConfig globalConfig_, IParticleVerifyer particleVerifyer_) {
        globalConfig = globalConfig_;
        fluenceToken = globalConfig_.fluenceToken();
        particleVerifyer = particleVerifyer_;
    }

    IERC20 public paymentToken;
    uint256 public pricePerEpoch;
    uint256 public requiredStake;
    string public appCID;
    uint256 public minWorkers;
    uint256 public maxWorkersPerProvider;
    uint256 public targetWorkers;
    string[] public effectorWasmsCids;
}

contract Config is ConfigState, ModuleBase, Initializable {
    constructor(GlobalConfig globalConfig_, IParticleVerifyer particleVerifyer_) ConfigState(globalConfig_, particleVerifyer_) {
        _disableInitializers();
    }

    function initialize(
        IERC20 paymentToken_,
        uint256 pricePerEpoch_,
        uint256 requiredStake_,
        string memory appCID_,
        uint256 minWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 targetWorkers_,
        string[] memory effectorWasmsCids_
    ) public initializer {
        paymentToken = paymentToken_;
        pricePerEpoch = pricePerEpoch_;
        requiredStake = requiredStake_;
        appCID = appCID_;
        minWorkers = minWorkers_;
        maxWorkersPerProvider = maxWorkersPerProvider_;
        targetWorkers = targetWorkers_;
        effectorWasmsCids = effectorWasmsCids_;
    }

    function setPricePerEpoch(uint256 pricePerEpoch_) external {
        pricePerEpoch = pricePerEpoch_;
    }

    function setRequiredStake(uint256 requiredStake_) external {
        requiredStake = requiredStake_;
    }

    function setAppCID(string calldata appCID_) external {
        appCID = appCID_;
    }
}
