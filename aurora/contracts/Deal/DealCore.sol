// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../Global/GlobalConfig.sol";
import "../ParticleVerifyer/IParticleVerifyer.sol";
import "./Workers.sol";
import "./Payment.sol";
import "./WithdrawManager.sol";

contract DealCore {
    GlobalConfig public immutable globalConfig;
    IERC20 public immutable fluenceToken;
    IERC20 public immutable paymentToken;
    IParticleVerifyer public immutable particleVerifyer;

    mapping(Module => address) public modules;
    mapping(address => Module) public moduleByAddress;

    uint256 public pricePerEpoch;
    uint256 public requiredStake;
    string public appCID;
    uint256 public minWorkers;
    uint256 public maxWorkersPerProvider;
    uint256 public targetWorkers;
    string[] public effectorWasmsCids;

    modifier onlyModule(Module module) {
        require(moduleByAddress[msg.sender] == module, "DealCore: only module");
        _;
    }

    constructor(
        GlobalConfig globalConfig_,
        address paymentToken_,
        uint256 pricePerEpoch_,
        uint256 requiredStake_,
        uint256 minWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 targetWorkers_,
        string memory appCID_,
        string[] memory effectorWasmsCids_,
        IParticleVerifyer particleVerifyer_
    ) {
        globalConfig = globalConfig_;
        fluenceToken = globalConfig_.fluenceToken();
        paymentToken = IERC20(paymentToken_);
        pricePerEpoch = pricePerEpoch_;
        requiredStake = requiredStake_;
        minWorkers = minWorkers_;
        maxWorkersPerProvider = maxWorkersPerProvider_;
        targetWorkers = targetWorkers_;
        appCID = appCID_;
        effectorWasmsCids = effectorWasmsCids_;
        particleVerifyer = particleVerifyer_;
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
