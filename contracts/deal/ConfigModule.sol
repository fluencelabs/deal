// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../global/interfaces/IGlobalConfig.sol";
import "./interfaces/IConfigModule.sol";
import "../utils/LinkedListWithUniqueKeys.sol";
import "./base/ModuleBase.sol";
import "./base/Types.sol";

abstract contract ConfigState {
    IERC20 internal immutable _fluenceToken;
    IGlobalConfig internal immutable _globalConfig;

    constructor(IGlobalConfig globalConfig_) {
        _globalConfig = globalConfig_;
        _fluenceToken = globalConfig_.fluenceToken();
    }

    uint256 internal _creationBlock;
    uint256 internal _requiredCollateral;
    uint256 internal _minWorkers;
    uint256 internal _targetWorkers;
    IERC20 internal _paymentToken;
    uint256 internal _pricePerEpoch;
    CIDV1 internal _appCID;
    CIDV1[] internal _effectors;

    IConfigModule.AccessType internal _accessType;
    LinkedListWithUniqueKeys.Bytes32List internal _accessList;
}

contract ConfigModule is ConfigState, ModuleBase, Initializable, IConfigModule {
    using LinkedListWithUniqueKeys for LinkedListWithUniqueKeys.Bytes32List;

    constructor(IGlobalConfig globalConfig_) ConfigState(globalConfig_) {}

    function initialize(
        IERC20 paymentToken_,
        uint256 pricePerEpoch_,
        uint256 requiredCollateral_,
        CIDV1 calldata appCID_,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        CIDV1[] calldata effectors_,
        AccessType accessType_,
        address[] calldata accessList_
    ) public initializer {
        _paymentToken = paymentToken_;
        _pricePerEpoch = pricePerEpoch_;
        _requiredCollateral = requiredCollateral_;
        _appCID = appCID_;
        _minWorkers = minWorkers_;
        _targetWorkers = targetWorkers_;

        uint256 length = effectors_.length;
        for (uint256 i = 0; i < length; i++) {
            _effectors.push(effectors_[i]);
        }

        _accessType = accessType_;
        length = accessList_.length;
        for (uint256 i = 0; i < length; i++) {
            _accessList.push(bytes32(bytes20(accessList_[i])));
        }

        _creationBlock = block.number;
    }

    // ------------------ VIEWS ---------------------
    function globalConfig() external view returns (IGlobalConfig) {
        return _globalConfig;
    }

    function paymentToken() external view returns (IERC20) {
        return _paymentToken;
    }

    function fluenceToken() external view returns (IERC20) {
        return _fluenceToken;
    }

    function creationBlock() external view returns (uint256) {
        return _creationBlock;
    }

    function pricePerEpoch() external view returns (uint256) {
        return _pricePerEpoch;
    }

    function targetWorkers() external view returns (uint256) {
        return _targetWorkers;
    }

    function requiredCollateral() external view returns (uint256) {
        return _requiredCollateral;
    }

    function minWorkers() external view returns (uint256) {
        return _minWorkers;
    }

    function effectors() external view returns (CIDV1[] memory) {
        return _effectors;
    }

    function accessType() external view returns (AccessType) {
        return _accessType;
    }

    function isInAccessList(address addr) external view returns (bool) {
        return _accessList.has(bytes32(bytes20(addr)));
    }

    function getAccessList() external view returns (address[] memory) {
        bytes32[] memory result = _accessList.toArray();

        /*
        uint256 length = result.length;
        assembly ("memory-safe") {
            return(result, mul(length, 32))
        }*/

        // TOD: mv to assembly
        address[] memory result2 = new address[](result.length);
        for (uint256 i = 0; i < result.length; i++) {
            result2[i] = address(bytes20(result[i]));
        }

        return result2;
    }

    function appCID() external view override returns (CIDV1 memory) {
        return _appCID;
    }

    // ------------------ MUTABLES ------------------
    function setAppCID(CIDV1 calldata appCID_) external onlyOwner {
        _appCID = appCID_;

        emit AppCIDChanged(appCID_);
    }

    function changeAccessType(AccessType accessType_) external onlyOwner {
        _accessType = accessType_;
    }

    function removeFromAccessList(address addr) external onlyOwner {
        _accessList.remove(bytes32(bytes20(addr)));
    }
}
