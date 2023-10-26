// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "./interfaces/IDealFactory.sol";
import "./interfaces/IGlobalCore.sol";
import "../deal/interfaces/IDeal.sol";
import "../utils/OwnableUpgradableDiamond.sol";

/*
 * @dev On init mas.sender becomes owner.
*/
contract DealFactory is UUPSUpgradeable, OwnableUpgradableDiamond, IDealFactory {
    // ----------------- Immutable -----------------
    IGlobalCore public immutable globalCore;
    IDeal public immutable dealImpl;

    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.dealFactory.storage.v1")) - 1);

    struct DealFactoryStorage {
        mapping(IDeal => bool) hasDeal;
    }

    DealFactoryStorage private _storage;

    function _getDealFactoryStorage() private pure returns (DealFactoryStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ----------------- Constructor -----------------
    // @custom:oz-upgrades-unsafe-allow state-variable-immutable constructor
    constructor(IGlobalCore globalCore_, IDeal dealImpl_) {
        globalCore = globalCore_;
        dealImpl = dealImpl_;
    }

    // ------------------ Initializer ------------------
    function initialize() initializer public {
        // OZ init.
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
    }

    // ----------------- View -----------------
    function hasDeal(IDeal deal) external view returns (bool) {
        return _getDealFactoryStorage().hasDeal[deal];
    }

    // ----------------- Mutable -----------------

    function deployDeal(
        CIDV1 calldata appCID_,
        IERC20 paymentToken_,
        uint256 collateralPerWorker_,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 pricePerWorkerEpoch_,
        CIDV1[] calldata effectors_,
        IDeal.AccessType accessType_,
        address[] calldata accessList_
    ) external returns (IDeal) {
        IDeal deal = IDeal(
            address(
                new ERC1967Proxy(
                    address(dealImpl),
                    abi.encodeWithSelector(
                        IDeal.initialize.selector,
                        appCID_,
                        paymentToken_,
                        collateralPerWorker_,
                        minWorkers_,
                        targetWorkers_,
                        maxWorkersPerProvider_,
                        pricePerWorkerEpoch_,
                        effectors_,
                        accessType_,
                        accessList_,
                        msg.sender
                    )
                )
            )
        );

        DealFactoryStorage storage dealFactoryStorage = _getDealFactoryStorage();
        dealFactoryStorage.hasDeal[deal] = true;

        emit DealCreated(msg.sender, deal, globalCore.currentEpoch());

        return deal;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
