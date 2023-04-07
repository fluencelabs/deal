// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "./interfaces/ICore.sol";
import "./interfaces/IConfig.sol";
import "./interfaces/IController.sol";
import "./interfaces/IPayment.sol";
import "./interfaces/IStatusController.sol";
import "./interfaces/IWorkers.sol";
import "./Types.sol";

contract Core is Initializable, OwnableUpgradeable, UUPSUpgradeable, ICore {
    mapping(Module => address) public modules;
    mapping(address => Module) public moduleByAddress;

    function initialize(
        IConfig config_,
        IController controller_,
        IPayment payment_,
        IStatusController statusController_,
        IWorkers workers_
    ) public initializer {
        modules[Module.Config] = address(config_);
        modules[Module.Controller] = address(controller_);
        modules[Module.Payment] = address(payment_);
        modules[Module.StatusController] = address(statusController_);
        modules[Module.Workers] = address(workers_);

        moduleByAddress[address(config_)] = Module.Config;
        moduleByAddress[address(controller_)] = Module.Controller;
        moduleByAddress[address(payment_)] = Module.Payment;
        moduleByAddress[address(statusController_)] = Module.StatusController;
        moduleByAddress[address(workers_)] = Module.Workers;

        __Ownable_init();
    }

    function getConfig() public view returns (IConfig) {
        return IConfig(modules[Module.Config]);
    }

    function getController() public view returns (IController) {
        return IController(modules[Module.Controller]);
    }

    function getPayment() public view returns (IPayment) {
        return IPayment(modules[Module.Payment]);
    }

    function getStatusController() public view returns (IStatusController) {
        return IStatusController(modules[Module.StatusController]);
    }

    function getWorkers() public view returns (IWorkers) {
        return IWorkers(modules[Module.Workers]);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
