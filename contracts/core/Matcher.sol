// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../utils/LinkedListWithUniqueKeys.sol";
import "./MarketOffers.sol";
import "./EpochController.sol";
import "./interfaces/IMatcher.sol";
import "../deal/interfaces/IDeal.sol";
import "../deal/interfaces/IConfig.sol";

abstract contract Matcher is MarketOffers, EpochController, IMatcher {
    using SafeERC20 for IERC20;
    using LinkedListWithUniqueKeys for LinkedListWithUniqueKeys.Bytes32List;

    // ----------------- Events -----------------
    event ComputeUnitMatched(bytes32 indexed peerId, bytes32 unitId, uint dealCreationBlock, CIDV1 appCID);

    // ----------------- Constants -----------------
    uint256 private constant _MIN_REMATCHING_EPOCHS = 2; //TODO: move to globalConstants

    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.market.storage.v1.matcher")) - 1);

    struct MarketStorage {
        mapping(address => uint256) lastMatchedEpoch;
    }

    OfferStorage private _storage;

    function _getMarketStorage() private pure returns (MarketStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ----------------- Constructor -----------------
    constructor() {
        _disableInitializers();
    }

    // ----------------- External Mutable -----------------
    // TODO: move this logic to offchain. Temp solution
    function matchDeal(IDeal deal) external {
        MarketStorage storage marketStorage = _getMarketStorage();

        require(currentEpoch() > marketStorage.lastMatchedEpoch[address(deal)] + _MIN_REMATCHING_EPOCHS, "Matcher: too early to rematch");

        uint pricePerWorkerEpoch = deal.pricePerWorkerEpoch();
        address paymentToken = address(deal.paymentToken());
        uint freeWorkerSlots = deal.targetWorkers() - deal.getComputeUnitCount();
        CIDV1[] memory effectors = deal.effectors();
        IDeal.AccessType accessType = deal.accessType();

        CIDV1 memory appCID = deal.appCID();
        uint creationBlock = deal.creationBlock();

        bool isDealMatched = false;
        LinkedListWithUniqueKeys.Bytes32List storage offerList = _getOffersList();

        bytes32 currentOfferId = offerList.first();
        while (currentOfferId != bytes32(0x00) && freeWorkerSlots > 0) {
            OfferInfo memory offer = getOffer(currentOfferId);

            if (
                (accessType == IConfig.AccessType.BLACKLIST && deal.isInAccessList(offer.owner)) ||
                //(accessType == IConfig.AccessType.WHITELIST && !deal.isInAccessList(computeProviderAddress)) ||
                pricePerWorkerEpoch < offer.minPricePerWorkerEpoch ||
                paymentToken != offer.paymentToken ||
                !_hasOfferEffectors(currentOfferId, effectors)
            ) {
                currentOfferId = offerList.next(currentOfferId);
                continue;
            }

            LinkedListWithUniqueKeys.Bytes32List storage peerList = _getFreePeerList(currentOfferId);

            bytes32 currentPeerId = peerList.first();
            while (currentPeerId != bytes32(0x00) && freeWorkerSlots > 0) {
                LinkedListWithUniqueKeys.Bytes32List storage computeUnitList = _getFreeComputeUnitList(currentPeerId);

                bytes32 currentUnitId = computeUnitList.first();
                while (currentUnitId != bytes32(0x00) && freeWorkerSlots > 0) {
                    _reserveComputeUnitForDeal(currentUnitId, deal);

                    freeWorkerSlots--;

                    emit ComputeUnitMatched(currentPeerId, currentUnitId, creationBlock, appCID);

                    currentUnitId = computeUnitList.next(currentUnitId);

                    if (!isDealMatched) {
                        isDealMatched = true;
                        break;
                    }
                }

                currentPeerId = peerList.next(currentPeerId);
            }

            currentOfferId = offerList.next(currentOfferId);
        }

        if (isDealMatched) {
            _getMarketStorage().lastMatchedEpoch[address(deal)] = currentEpoch();
        }
    }
}
