// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "src/utils/OwnableUpgradableDiamond.sol";
import "src/deal/interfaces/IDeal.sol";
import "src/deal/DealProxy.sol";
import "src/core/modules/BaseModule.sol";
import "./interfaces/IDealFactory.sol";
import {LibEpochController} from "src/lib/LibEpochController.sol";

/*
 * @dev On init mas.sender becomes owner.
 */
contract DealFactoryFacet is BaseModule, IDealFactory {
    using SafeERC20 for IERC20;

    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.market.storage.v1.dealFactory")) - 1);

    struct DealFactoryStorage {
        mapping(IDeal => bool) hasDeal;
    }

    constructor(ICore core_) BaseModule(core_) {} // disables initializer, immutable set

    function _getDealFactoryStorage() private pure returns (DealFactoryStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ----------------- View -----------------
    function hasDeal(IDeal deal) external view returns (bool) {
        return _getDealFactoryStorage().hasDeal[deal];
    }

    // ----------------- Mutable -----------------
    function deployDeal(
        CIDV1 calldata appCID_,
        IERC20 paymentToken_,
        uint256 depositAmount_,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 pricePerWorkerEpoch_,
        CIDV1[] calldata effectors_,
        IConfig.AccessType providersAccessType_,
        address[] calldata providersAccessList_,
        uint256 protocolVersion_
    ) external returns (IDeal) {
        DealFactoryStorage storage dealFactoryStorage = _getDealFactoryStorage();

        IDeal deal = IDeal(
            address(
                new DealProxy(
                    core,
                    abi.encodeWithSelector(
                        IDeal.initialize.selector,
                        core,
                        appCID_,
                        paymentToken_,
                        minWorkers_,
                        targetWorkers_,
                        maxWorkersPerProvider_,
                        pricePerWorkerEpoch_,
                        effectors_,
                        providersAccessType_,
                        providersAccessList_,
                        protocolVersion_
                    )
                )
            )
        );

        dealFactoryStorage.hasDeal[deal] = true;

        uint256 minAmount = pricePerWorkerEpoch_ * targetWorkers_ * core.minDealDepositedEpochs();

        require(depositAmount_ >= minAmount, "Deposit amount is less than minimum required");

        paymentToken_.safeTransferFrom(msg.sender, address(this), depositAmount_);
        paymentToken_.safeApprove(address(deal), depositAmount_);
        deal.deposit(depositAmount_);

        OwnableUpgradableDiamond(address(deal)).transferOwnership(msg.sender);

        emit DealCreated(
            msg.sender,
            deal,
            LibEpochController.currentEpoch(),
            paymentToken_,
            minWorkers_,
            targetWorkers_,
            maxWorkersPerProvider_,
            pricePerWorkerEpoch_,
            effectors_,
            appCID_,
            providersAccessType_,
            providersAccessList_,
            protocolVersion_
        );

        return deal;
    }
}
