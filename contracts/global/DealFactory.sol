// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "../global/interfaces/IGlobalConfig.sol";
import "../deal/interfaces/ICore.sol";
import "../deal/interfaces/IConfigModule.sol";
import "../deal/interfaces/IPaymentModule.sol";
import "../deal/interfaces/IStatusModule.sol";
import "../deal/interfaces/IWorkersModule.sol";
import "./interfaces/IFactory.sol";
import "../deal/base/ModuleProxy.sol";

abstract contract DealFactoryState is IFactory {
    // ----------------- Types -----------------
    struct Deal {
        ICore core;
        IConfigModule configModule;
        IPaymentModule paymentModule;
        IStatusModule statusModule;
        IWorkersModule workersModule;
    }

    // ----------------- Events -----------------
    event DealCreated(
        Deal deal,
        address paymentToken,
        uint256 pricePerEpoch,
        uint256 requiredCollateral,
        uint256 minWorkers,
        uint256 targetWorkers,
        CIDV1 appCID,
        CIDV1[] effectorWasmsCids,
        uint256 epoch
    );

    // ----------------- Constants -----------------
    uint256 public constant PRICE_PER_EPOCH = 83 * 10 ** 15;
    uint256 public constant REQUIRED_COLLATERAL = 1 * 10 ** 18;

    // ----------------- Immutable -----------------
    IGlobalConfig public immutable globalConfig;
    IERC20 public immutable defaultPaymentToken;

    ICore public immutable coreImpl;
    IConfigModule public immutable configImpl;
    IPaymentModule public immutable paymentImpl;
    IStatusModule public immutable statusImpl;
    IWorkersModule public immutable workersImpl;

    // ----------------- Vars -----------------
    mapping(address => bool) public isDeal;

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
}

contract DealFactory is DealFactoryState, UUPSUpgradeable {
    modifier onlyOwner() {
        require(msg.sender == globalConfig.owner(), "Only owner can call this function");
        _;
    }

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

    // ----------------- Mutable -----------------
    function createDeal(
        uint256 minWorkers_,
        uint256 targetWorkers_,
        CIDV1 calldata appCID_,
        CIDV1[] calldata effectors
    ) external returns (address) {
        Deal memory deal;

        bytes memory emptyBytes;

        {
            // Create deal system
            ICore core = ICore(address(new ERC1967Proxy(address(coreImpl), emptyBytes)));
            IConfigModule configModule = IConfigModule(
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
                            targetWorkers_,
                            effectors
                        ),
                        address(core)
                    )
                )
            );

            IPaymentModule paymentModule = IPaymentModule(address(new ModuleProxy(address(paymentImpl), emptyBytes, address(core))));
            IStatusModule statusModule = IStatusModule(address(new ModuleProxy(address(statusImpl), emptyBytes, address(core))));
            IWorkersModule workersModule = IWorkersModule(address(new ModuleProxy(address(workersImpl), emptyBytes, address(core))));

            // Initialize deal system
            core.initialize(configModule, paymentModule, statusModule, workersModule);
            core.transferOwnership(msg.sender);

            // throw event
            deal.core = core;
            deal.configModule = configModule;
            deal.paymentModule = paymentModule;
            deal.statusModule = statusModule;
            deal.workersModule = workersModule;
        }

        isDeal[address(deal.core)] = true;

        emit DealCreated(
            deal,
            address(defaultPaymentToken),
            PRICE_PER_EPOCH,
            REQUIRED_COLLATERAL,
            minWorkers_,
            targetWorkers_,
            appCID_,
            effectors,
            deal.configModule.globalConfig().epochManager().currentEpoch()
        );

        return address(deal.core);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
