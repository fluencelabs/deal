// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../global/interfaces/IGlobalConfig.sol";
import "./interfaces/IConfigModule.sol";
import "./base/ModuleBase.sol";
import "./base/Types.sol";

abstract contract ConfigState is IConfigModule {
    IGlobalConfig public immutable globalConfig;
    IERC20 public immutable fluenceToken;

    constructor(IGlobalConfig globalConfig_) {
        globalConfig = globalConfig_;
        fluenceToken = globalConfig_.fluenceToken();
    }

    IERC20 public paymentToken;
    uint256 public pricePerEpoch;
    uint256 public requiredCollateral;

    uint256 public minWorkers;
    uint256 public targetWorkers;
    uint256 public creationBlock;

    CIDV1 internal _appCID;
    CIDV1[] internal _effectors;
}

contract ConfigModule is ConfigState, ModuleBase, Initializable {
    constructor(IGlobalConfig globalConfig_) ConfigState(globalConfig_) {}

    function initialize(
        IERC20 paymentToken_,
        uint256 pricePerEpoch_,
        uint256 requiredCollateral_,
        CIDV1 calldata appCID_,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        CIDV1[] memory effectors_
    ) public initializer {
        paymentToken = paymentToken_;
        pricePerEpoch = pricePerEpoch_;
        requiredCollateral = requiredCollateral_;
        _appCID = appCID_;
        minWorkers = minWorkers_;
        targetWorkers = targetWorkers_;

        uint256 length = effectors_.length;
        for (uint256 i = 0; i < length; i++) {
            _effectors.push(effectors_[i]);
        }

        creationBlock = block.number;
    }

    function effectors() external view override returns (CIDV1[] memory) {
        return _effectors;
    }

    function appCID() external view override returns (CIDV1 memory) {
        return _appCID;
    }

    function setAppCID(CIDV1 calldata appCID_) external onlyCore {
        _appCID = appCID_;
    }
}
