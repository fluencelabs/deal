// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "./interfaces/ICore.sol";
import "./interfaces/IConfigModule.sol";
import "./interfaces/IPaymentModule.sol";
import "./interfaces/IStatusModule.sol";
import "./interfaces/IWorkersModule.sol";
import "./base/Types.sol";

contract Core is UUPSUpgradeable, OwnableUpgradeable, ICore {
    mapping(Module => address) public moduleByType;
    mapping(address => Module) public moduleByAddress;

    constructor() {
        _disableInitializers();
    }

    function initialize(
        IConfigModule configModule_,
        IPaymentModule paymentModule_,
        IStatusModule statusModule_,
        IWorkersModule workersModule_
    ) public initializer {
        moduleByType[Module.Config] = address(configModule_);
        moduleByType[Module.Payment] = address(paymentModule_);
        moduleByType[Module.Status] = address(statusModule_);
        moduleByType[Module.Workers] = address(workersModule_);

        moduleByAddress[address(configModule_)] = Module.Config;
        moduleByAddress[address(paymentModule_)] = Module.Payment;
        moduleByAddress[address(statusModule_)] = Module.Status;
        moduleByAddress[address(workersModule_)] = Module.Workers;
    }

    function owner() public view override(OwnableUpgradeable, ICore) returns (address) {
        return OwnableUpgradeable.owner();
    }

    function configModule() public view returns (IConfigModule) {
        return IConfigModule(moduleByType[Module.Config]);
    }

    function paymentModule() public view returns (IPaymentModule) {
        return IPaymentModule(moduleByType[Module.Payment]);
    }

    function statusModule() public view returns (IStatusModule) {
        return IStatusModule(moduleByType[Module.Status]);
    }

    function workersModule() public view returns (IWorkersModule) {
        return IWorkersModule(moduleByType[Module.Workers]);
    }

    function transferOwnership(address newOwner) public override(OwnableUpgradeable, ICore) {
        OwnableUpgradeable.transferOwnership(newOwner);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {
        //TODO: check that new implementation from DAO
    }
}
