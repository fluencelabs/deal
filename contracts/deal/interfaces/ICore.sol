// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import "./IConfigModule.sol";
import "./IPaymentModule.sol";
import "./IStatusModule.sol";
import "./IWorkersModule.sol";

enum Module {
    None,
    Config,
    Payment,
    Status,
    Workers
}

interface ICore {
    function initialize(IConfigModule config_, IPaymentModule payment_, IStatusModule statys_, IWorkersModule workers_) external;

    function moduleByType(Module module) external view returns (address);

    function moduleByAddress(address module) external view returns (Module);

    function configModule() external view returns (IConfigModule);

    function paymentModule() external view returns (IPaymentModule);

    function statusModule() external view returns (IStatusModule);

    function workersModule() external view returns (IWorkersModule);

    function owner() external view returns (address);

    function transferOwnership(address newOwner) external;
}
