// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "../global/interfaces/IGlobalConfig.sol";
import "../mocks/MockParticleVerifyer.sol";
import "../deal/interfaces/ICore.sol";
import "../deal/interfaces/IConfigModule.sol";
import "../deal/interfaces/IPaymentModule.sol";
import "../deal/interfaces/IStatusModule.sol";
import "../deal/interfaces/IWorkersModule.sol";
import "./interfaces/IFactory.sol";
import "../deal/base/ModuleProxy.sol";

abstract contract DealFactoryState is IFactory {
    constructor(
        IGlobalConfig globalConfig_,
        IERC20 defaultPaymentToken_,
        ICore coreImpl_,
        IConfigModule configImpl_,
        IPaymentModule paymentImpl_,
        IStatusModule statusImpl_,
        IWorkersModule workersImpl_
    ) {
        globalConfig = globalConfig_;
        defaultPaymentToken = defaultPaymentToken_;

        coreImpl = coreImpl_;
        configImpl = configImpl_;
        paymentImpl = paymentImpl_;
        statusImpl = statusImpl_;
        workersImpl = workersImpl_;
    }

    uint256 public constant PRICE_PER_EPOCH = 83 * 10 ** 15;
    uint256 public constant REQUIRED_COLLATERAL = 1 * 10 ** 18;
    uint256 public constant MAX_WORKERS_PER_PROVIDER = 10000000;

    IGlobalConfig public immutable globalConfig;
    IERC20 public immutable defaultPaymentToken;

    ICore public immutable coreImpl;
    IConfigModule public immutable configImpl;
    IPaymentModule public immutable paymentImpl;
    IStatusModule public immutable statusImpl;
    IWorkersModule public immutable workersImpl;

    mapping(address => bool) public isDeal;
}

contract DealFactory is DealFactoryState, UUPSUpgradeable {
    struct Deal {
        ICore core;
        IConfigModule config;
        IPaymentModule payment;
        IStatusModule statusController;
        IWorkersModule workers;
    }

    event DealCreated(
        Deal deal,
        address paymentToken,
        uint256 pricePerEpoch,
        uint256 requiredCollateral,
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
        IConfigModule configImpl_,
        IPaymentModule paymentImpl_,
        IStatusModule statusImpl_,
        IWorkersModule workersImpl_
    ) DealFactoryState(globalConfig_, defaultPaymentToken_, coreImpl_, configImpl_, paymentImpl_, statusImpl_, workersImpl_) {
        _disableInitializers();
    }

    modifier onlyOwner() {
        require(msg.sender == globalConfig.owner(), "Only owner can call this function");
        _;
    }

    function createDeal(
        uint256 minWorkers_,
        uint256 targetWorkers_,
        string calldata appCID_,
        string[] calldata effectors
    ) external returns (address) {
        Deal memory deal = _deployDeal(minWorkers_, targetWorkers_, appCID_, effectors);

        emit DealCreated(
            deal,
            address(defaultPaymentToken),
            PRICE_PER_EPOCH,
            REQUIRED_COLLATERAL,
            minWorkers_,
            MAX_WORKERS_PER_PROVIDER,
            targetWorkers_,
            appCID_,
            effectors,
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
        IConfigModule config = IConfigModule(
            address(
                new ModuleProxy(
                    address(configImpl),
                    abi.encodeWithSelector(
                        IConfigModule.initialize.selector,
                        defaultPaymentToken,
                        PRICE_PER_EPOCH,
                        REQUIRED_COLLATERAL,
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

        IPaymentModule payment = IPaymentModule(address(new ModuleProxy(address(paymentImpl), emptyBytes, address(core))));
        IStatusModule statusController = IStatusModule(address(new ModuleProxy(address(statusImpl), emptyBytes, address(core))));
        IWorkersModule workers = IWorkersModule(address(new ModuleProxy(address(workersImpl), emptyBytes, address(core))));

        core.initialize(config, payment, statusController, workers);
        core.transferOwnership(msg.sender);

        deal.core = core;
        deal.config = config;
        deal.payment = payment;
        deal.statusController = statusController;
        deal.workers = workers;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
