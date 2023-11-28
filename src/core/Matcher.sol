// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IMatcher.sol";
import "./interfaces/IMatcher.sol";
import "src/deal/interfaces/IDeal.sol";
import "src/deal/interfaces/IConfig.sol";
import "src/utils/LinkedListWithUniqueKeys.sol";
import "./CapacityCommitment.sol";
import "./GlobalConst.sol";
import "./Market.sol";
import "./EpochController.sol";

contract Matcher is CapacityCommitment, IMatcher {
    using SafeERC20 for IERC20;
    using LinkedListWithUniqueKeys for LinkedListWithUniqueKeys.Bytes32List;

    // ----------------- Events -----------------
    event ComputeUnitMatched(bytes32 indexed peerId, bytes32 unitId, uint256 dealCreationBlock, CIDV1 appCID);

    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.core.storage.v1.matcher")) - 1);

    struct MatcherStorage {
        mapping(address => uint256) lastMatchedEpoch;
    }

    OfferStorage private _storage;

    function _getMatcherStorage() private pure returns (MatcherStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ----------------- External Mutable -----------------
    // TODO: move this logic to offchain. Temp solution
    function matchDeal(IDeal deal) external {
        MatcherStorage storage matcherStorage = _getMatcherStorage();

        uint256 lastMatchedEpoch = matcherStorage.lastMatchedEpoch[address(deal)];
        require(
            lastMatchedEpoch == 0 || currentEpoch() > lastMatchedEpoch + minRematchingEpoches(),
            "Matcher: too early to rematch"
        );

        uint256 pricePerWorkerEpoch = deal.pricePerWorkerEpoch();
        address paymentToken = address(deal.paymentToken());
        uint256 freeWorkerSlots = deal.targetWorkers() - deal.getComputeUnitCount();
        CIDV1[] memory effectors = deal.effectors();
        IDeal.AccessType accessType = deal.accessType();

        CIDV1 memory appCID = deal.appCID();
        uint256 creationBlock = deal.creationBlock();

        bool isDealMatched = false;
        LinkedListWithUniqueKeys.Bytes32List storage offerList = _getOffersList();

        bytes32 currentOfferId = offerList.first();

        while (currentOfferId != bytes32(0x00) && freeWorkerSlots > 0) {
            OfferInfo memory offer = getOffer(currentOfferId);

            if (
                (accessType == IConfig.AccessType.BLACKLIST && deal.isInAccessList(offer.owner))
                //(accessType == IConfig.AccessType.WHITELIST && !deal.isInAccessList(computeProviderAddress)) ||
                || pricePerWorkerEpoch < offer.minPricePerWorkerEpoch || paymentToken != offer.paymentToken
                    || !_hasOfferEffectors(currentOfferId, effectors)
            ) {
                currentOfferId = offerList.next(currentOfferId);
                continue;
            }

            LinkedListWithUniqueKeys.Bytes32List storage peerList = _getFreePeerList(currentOfferId);

            bytes32 currentPeerId = peerList.first();
            while (currentPeerId != bytes32(0x00) && freeWorkerSlots > 0) {
                LinkedListWithUniqueKeys.Bytes32List storage computeUnitList = _getFreeComputeUnitList(currentPeerId);

                bytes32 currentUnitId = computeUnitList.first();
                bytes32 nextCurrentPeerId = peerList.next(currentPeerId); // becouse mvComputeUnitToDeal can remove currentPeerId from peerList

                _mvComputeUnitToDeal(currentUnitId, deal);

                freeWorkerSlots--;

                // TODO: only for NOX -- remove in future
                emit ComputeUnitMatched(currentPeerId, currentUnitId, creationBlock, appCID);

                if (!isDealMatched) {
                    isDealMatched = true;
                }

                //TODO: check max peers per provider
                currentPeerId = bytes32(nextCurrentPeerId);
            }

            currentOfferId = offerList.next(currentOfferId);
        }

        if (isDealMatched) {
            _getMatcherStorage().lastMatchedEpoch[address(deal)] = currentEpoch();
        }
    }
}
