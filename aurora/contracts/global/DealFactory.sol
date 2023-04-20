// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "../global/interfaces/IGlobalConfig.sol";
import "../mocks/MockParticleVerifyer.sol";
import "../deal/interfaces/ICore.sol";
import "../deal/interfaces/IConfig.sol";
import "../deal/interfaces/IController.sol";
import "../deal/interfaces/IPayment.sol";
import "../deal/interfaces/IStatusController.sol";
import "../deal/interfaces/IWorkers.sol";
import "./interfaces/IFactory.sol";
import "../deal/base/ModuleProxy.sol";

abstract contract DealFactoryState is IFactory {
    constructor(
        IGlobalConfig globalConfig_,
        IERC20 defaultPaymentToken_,
        ICore coreImpl_,
        IConfig configImpl_,
        IController controllerImpl_,
        IPayment paymentImpl_,
        IStatusController statusControllerImpl_,
        IWorkers workersImpl_
    ) {
        globalConfig = globalConfig_;
        defaultPaymentToken = defaultPaymentToken_;

        coreImpl = coreImpl_;
        configImpl = configImpl_;
        controllerImpl = controllerImpl_;
        paymentImpl = paymentImpl_;
        statusControllerImpl = statusControllerImpl_;
        workersImpl = workersImpl_;
    }

    uint256 public constant PRICE_PER_EPOCH = 83 * 10 ** 15;
    uint256 public constant REQUIRED_STAKE = 1 * 10 ** 18;
    uint256 public constant MAX_WORKERS_PER_PROVIDER = 10000000;

    IGlobalConfig public immutable globalConfig;
    IERC20 public immutable defaultPaymentToken;

    ICore public immutable coreImpl;
    IConfig public immutable configImpl;
    IController public immutable controllerImpl;
    IPayment public immutable paymentImpl;
    IStatusController public immutable statusControllerImpl;
    IWorkers public immutable workersImpl;

    mapping(address => bool) public isDeal;
}

contract DealFactory is DealFactoryState, UUPSUpgradeable {
    struct Deal {
        ICore core;
        IConfig config;
        IController controller;
        IPayment payment;
        IStatusController statusController;
        IWorkers workers;
    }
    event DealCreated(
        Deal deal,
        address paymentToken,
        uint256 pricePerEpoch,
        uint256 requiredStake,
        uint256 minWorkers,
        uint256 maxWorkersPerProvider,
        uint256 targetWorkers,
        string appCID,
        string[] effectorWasmsCids,
        uint256 epoch
    );

    constructor(
        IGlobalConfig globalConfig_,
        IERC20 defaultPaymentToken_,
        ICore coreImpl_,
        IConfig configImpl_,
        IController controllerImpl_,
        IPayment paymentImpl_,
        IStatusController statusControllerImpl_,
        IWorkers workersImpl_
    )
        DealFactoryState(
            globalConfig_,
            defaultPaymentToken_,
            coreImpl_,
            configImpl_,
            controllerImpl_,
            paymentImpl_,
            statusControllerImpl_,
            workersImpl_
        )
    {
        _disableInitializers();
    }

    modifier onlyOwner() {
        require(msg.sender == globalConfig.owner(), "Only owner can call this function");
        _;
    }

    function createDeal(uint256 minWorkers_, uint256 targetWorkers_, string memory appCID_) external returns (address) {
        string[] memory effectorWasmsCids_ = new string[](0);

        Deal memory deal = _deployDeal(minWorkers_, targetWorkers_, appCID_, effectorWasmsCids_);

        emit DealCreated(
            deal,
            address(defaultPaymentToken),
            PRICE_PER_EPOCH,
            REQUIRED_STAKE,
            minWorkers_,
            MAX_WORKERS_PER_PROVIDER,
            targetWorkers_,
            appCID_,
            effectorWasmsCids_,
            deal.config.globalConfig().epochManager().currentEpoch()
        );

        isDeal[address(deal.core)] = true;

        return address(deal.core);
    }

    function _deployDeal(
        uint256 minWorkers_,
        uint256 targetWorkers_,
        string memory appCID_,
        string[] memory effectorWasmsCids_
    ) private returns (Deal memory deal) {
        bytes memory emptyBytes;

        ICore core = ICore(address(new ERC1967Proxy(address(coreImpl), emptyBytes)));
        IConfig config = IConfig(
            address(
                new ModuleProxy(
                    address(configImpl),
                    abi.encodeWithSelector(
                        IConfig.initialize.selector,
                        defaultPaymentToken,
                        PRICE_PER_EPOCH,
                        REQUIRED_STAKE,
                        appCID_,
                        minWorkers_,
                        MAX_WORKERS_PER_PROVIDER,
                        targetWorkers_,
                        effectorWasmsCids_
                    ),
                    address(core)
                )
            )
        );

        IController controller = IController(
            address(new ModuleProxy(address(controllerImpl), abi.encodeWithSelector(IController.initialize.selector), address(core)))
        );
        IPayment payment = IPayment(address(new ModuleProxy(address(paymentImpl), emptyBytes, address(core))));
        IStatusController statusController = IStatusController(
            address(new ModuleProxy(address(statusControllerImpl), emptyBytes, address(core)))
        );
        IWorkers workers = IWorkers(address(new ModuleProxy(address(workersImpl), emptyBytes, address(core))));

        core.initialize(config, controller, payment, statusController, workers);
        controller.transferOwnership(msg.sender);

        deal.core = core;
        deal.config = config;
        deal.controller = controller;
        deal.payment = payment;
        deal.statusController = statusController;
        deal.workers = workers;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
