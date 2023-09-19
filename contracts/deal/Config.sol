// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../utils/LinkedListWithUniqueKeys.sol";
import "./interfaces/IConfig.sol";

contract Config is IConfig {
    using LinkedListWithUniqueKeys for LinkedListWithUniqueKeys.Bytes32List;

    // ------------------ Immutable ------------------
    IERC20 private immutable _fluenceToken;
    IGlobalConfig private immutable _globalConfig;

    // ------------------ Private Vars ------------------
    uint256 private _creationBlock;
    CIDV1 private _appCID;

    // --- configs ---
    IERC20 private _paymentToken;
    uint256 private _collateralPerWorker;
    uint256 private _minWorkers;
    uint256 private _targetWorkers;
    uint256 private _maxWorkersPerProvider;
    uint256 private _pricePerWorkerEpoch;
    CIDV1[] private _effectors;

    // --- access ---
    AccessType private _accessType;
    LinkedListWithUniqueKeys.Bytes32List private _accessList;

    // ------------------ Constructor ------------------
    constructor(IGlobalConfig globalConfig_) {
        _globalConfig = globalConfig_;
        _fluenceToken = globalConfig_.fluenceToken();
    }

    // ------------------ Proxy Constructor ------------------

    /* TODO: initialize
    function initialize(
        IERC20 paymentToken_,
        uint256 pricePerWorkerEpoch_,
        uint256 collateralPerWorker_,
        CIDV1 calldata appCID_,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        CIDV1[] calldata effectors_,
        AccessType accessType_,
        address[] calldata accessList_
    ) public initializer {
        _paymentToken = paymentToken_;
        _pricePerWorkerEpoch = pricePerWorkerEpoch_;
        _collateralPerWorker = collateralPerWorker_;
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
    }*/

    // ------------------ View Functions ---------------------
    function globalConfig() public view returns (IGlobalConfig) {
        return _globalConfig;
    }

    function paymentToken() public view returns (IERC20) {
        return _paymentToken;
    }

    function fluenceToken() public view returns (IERC20) {
        return _fluenceToken;
    }

    function creationBlock() public view returns (uint256) {
        return _creationBlock;
    }

    function pricePerWorkerEpoch() public view returns (uint256) {
        return _pricePerWorkerEpoch;
    }

    function targetWorkers() public view returns (uint256) {
        return _targetWorkers;
    }

    function collateralPerWorker() public view returns (uint256) {
        return _collateralPerWorker;
    }

    function minWorkers() public view returns (uint256) {
        return _minWorkers;
    }

    function effectors() public view returns (CIDV1[] memory) {
        return _effectors;
    }

    function accessType() public view returns (AccessType) {
        return _accessType;
    }

    function isInAccessList(address addr) public view returns (bool) {
        return _accessList.has(bytes32(bytes20(addr)));
    }

    function getAccessList() public view returns (address[] memory) {
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

    function appCID() external view returns (CIDV1 memory) {
        return _appCID;
    }

    // ------------------ Mutable Functions ------------------
    function setAppCID(CIDV1 calldata appCID_) external /*TODO: onlyOwner */ {
        _appCID = appCID_;

        emit AppCIDChanged(appCID_);
    }

    function changeAccessType(AccessType accessType_) external /*TODO: onlyOwner*/ {
        _accessType = accessType_;
    }

    function removeFromAccessList(address addr) external /*TODO: onlyOwner*/ {
        _accessList.remove(bytes32(bytes20(addr)));
    }
}
