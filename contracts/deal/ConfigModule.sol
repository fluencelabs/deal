// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../global/interfaces/IParticleVerifyer.sol";
import "../global/interfaces/IGlobalConfig.sol";
import "./interfaces/IConfigModule.sol";
import "./base/ModuleBase.sol";

abstract contract ConfigState is IConfigModule {
    IGlobalConfig public immutable globalConfig;
    IERC20 public immutable fluenceToken;
    IParticleVerifyer public immutable particleVerifyer;

    constructor(IGlobalConfig globalConfig_, IParticleVerifyer particleVerifyer_) {
        globalConfig = globalConfig_;
        fluenceToken = globalConfig_.fluenceToken();
        particleVerifyer = particleVerifyer_;
    }

    IERC20 public paymentToken;
    uint256 public pricePerEpoch;
    uint256 public requiredCollateral;
    string public appCID;
    uint256 public minWorkers;
    uint256 public maxWorkersPerProvider;
    uint256 public targetWorkers;

    string[] internal _effectors;
}

contract ConfigModule is ConfigState, ModuleBase, Initializable {
    event AppCIDChanged(string newAppCID);

    constructor(IGlobalConfig globalConfig_, IParticleVerifyer particleVerifyer_) ConfigState(globalConfig_, particleVerifyer_) {}

    function initialize(
        IERC20 paymentToken_,
        uint256 pricePerEpoch_,
        uint256 requiredCollateral_,
        string memory appCID_,
        uint256 minWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 targetWorkers_,
        string[] memory effectors_
    ) public initializer {
        paymentToken = paymentToken_;
        pricePerEpoch = pricePerEpoch_;
        requiredCollateral = requiredCollateral_;
        appCID = appCID_;
        minWorkers = minWorkers_;
        maxWorkersPerProvider = maxWorkersPerProvider_;
        targetWorkers = targetWorkers_;
        _effectors = effectors_;
    }

    function effectors() external view override returns (string[] memory) {
        return _effectors;
    }

    function setAppCID(string calldata appCID_) external onlyOwner {
        appCID = appCID_;

        emit AppCIDChanged(appCID_);
    }
}
