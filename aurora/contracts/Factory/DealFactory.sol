// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "../Global/GlobalConfig.sol";
import "../Mock/MockParticleVerifyer.sol";
import "../Deal/Core.sol";
import "../Deal/Config.sol";
import "../Deal/Controller.sol";
import "../Deal/Payment.sol";
import "../Deal/StatusController.sol";
import "../Deal/Workers.sol";
import "../Deal/DealProxy.sol";
import "../ParticleVerifyer/IParticleVerifyer.sol";

contract DealFactory {
    event DealCreated(
        address deal,
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

    uint256 public constant PRICE_PER_EPOCH = 83 * 10 ** 15;
    uint256 public constant REQUIRED_STAKE = 1 * 10 ** 18;
    uint256 public constant MAX_WORKERS_PER_PROVIDER = 10000000;

    IERC20 public immutable defaultPaymentToken;

    Core public immutable coreImpl;
    Config public immutable configImpl;
    Controller public immutable controllerImpl;
    Payment public immutable paymentImpl;
    StatusController public immutable statusControllerImpl;
    Workers public immutable workersImpl;

    mapping(address => bool) public deals;

    constructor(GlobalConfig globalConfig_, IERC20 defaultPaymentToken_) {
        defaultPaymentToken = defaultPaymentToken_;

        coreImpl = new Core();
        configImpl = new Config(globalConfig_, new MockParticleVerifyer());
        controllerImpl = new Controller();
        paymentImpl = new Payment();
        statusControllerImpl = new StatusController();
        workersImpl = new Workers();
    }

    function createDeal(uint256 minWorkers_, uint256 targetWorkers_, string memory appCID_) external {
        string[] memory effectorWasmsCids_ = new string[](0);
        bytes memory emptyBytes;

        Core core = Core(address(new ERC1967Proxy(address(coreImpl), emptyBytes)));
        Config config = Config(
            address(
                new DealProxy(
                    address(configImpl),
                    abi.encodeWithSelector(
                        Config.initialize.selector,
                        defaultPaymentToken,
                        PRICE_PER_EPOCH,
                        REQUIRED_STAKE,
                        appCID_,
                        minWorkers_,
                        MAX_WORKERS_PER_PROVIDER,
                        targetWorkers_,
                        effectorWasmsCids_
                    ),
                    core
                )
            )
        );
        {
            Controller controller = Controller(address(new DealProxy(address(controllerImpl), emptyBytes, core)));
            Payment payment = Payment(address(new DealProxy(address(paymentImpl), emptyBytes, core)));
            StatusController statusController = StatusController(address(new DealProxy(address(statusControllerImpl), emptyBytes, core)));
            Workers workers = Workers(address(new DealProxy(address(workersImpl), emptyBytes, core)));

            core.initialize(config, controller, payment, statusController, workers);

            deals[address(core)] = true;

            core.transferOwnership(msg.sender);
        }

        emit DealCreated(
            address(core),
            address(defaultPaymentToken),
            PRICE_PER_EPOCH,
            REQUIRED_STAKE,
            minWorkers_,
            MAX_WORKERS_PER_PROVIDER,
            targetWorkers_,
            appCID_,
            effectorWasmsCids_,
            config.globalConfig().epochManager().currentEpoch()
        );
    }
}
