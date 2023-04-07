// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "./IConfig.sol";
import "./IController.sol";
import "./IPayment.sol";
import "./IStatusController.sol";
import "./IWorkers.sol";
import "../Types.sol";

interface ICore {
    function modules(Module module) external view returns (address);

    function moduleByAddress(address module) external view returns (Module);

    function getConfig() external view returns (IConfig);

    function getController() external view returns (IController);

    function getPayment() external view returns (IPayment);

    function getStatusController() external view returns (IStatusController);

    function getWorkers() external view returns (IWorkers);
}
