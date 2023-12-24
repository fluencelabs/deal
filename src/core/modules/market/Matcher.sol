// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/IMatcher.sol";
import "./interfaces/IMatcher.sol";
import "src/deal/interfaces/IDeal.sol";
import "src/deal/interfaces/IConfig.sol";
import "src/utils/LinkedListWithUniqueKeys.sol";
import "src/core/modules/BaseModule.sol";
import "./Offer.sol";

contract Matcher is Offer, IMatcher {
    using SafeERC20 for IERC20;
    using LinkedListWithUniqueKeys for LinkedListWithUniqueKeys.Bytes32List;

    // ----------------- Events -----------------
    event ComputeUnitMatched(bytes32 indexed peerId, bytes32 unitId, uint256 dealCreationBlock, CIDV1 appCID);

    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.market.storage.v1.matcher")) - 1);

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
    function matchDeal(IDeal deal, bytes32[] calldata computeUnits) external {
        ICore core = _core();
        MatcherStorage storage matcherStorage = _getMatcherStorage();

        uint256 lastMatchedEpoch = matcherStorage.lastMatchedEpoch[address(deal)];
        uint256 currentEpoch = core.currentEpoch();
        require(
            lastMatchedEpoch == 0 || currentEpoch > lastMatchedEpoch + core.minDealRematchingEpoches(),
            "Matcher: too early to rematch"
        );

        uint256 pricePerWorkerEpoch = deal.pricePerWorkerEpoch();
        address paymentToken = address(deal.paymentToken());
        uint dealComputeUnitCount = deal.getComputeUnitCount();
        uint256 freeWorkerSlots = deal.targetWorkers() - dealComputeUnitCount;
        uint256 freeWorkerSlotsCurrent = freeWorkerSlots;
        CIDV1[] memory effectors = deal.effectors();

        CIDV1 memory appCID = deal.appCID();
        uint256 creationBlock = deal.creationBlock();

        bool isDealMatched = false;

        for (uint i = 0; i < computeUnits.length; ++i) {
            bytes32 computeUnitId = computeUnits[i];
            // Get CU and start checking, if smth wrong - skip.
            // TODO: notify user that match fulfilled not fully (or discuss and close).
            ComputeUnit memory computeUnit  = getComputeUnit(computeUnitId);
            // TODO: Catch CU does not exist error and pass: make _getOfferStorage() as internal.
            // Check if CU available.
            if (computeUnit.deal != address(0)) {
                continue;
            }

            bytes32 peerId = computeUnit.peerId;
            ComputePeer memory peer = getComputePeer(peerId);
            bytes32 offerId = peer.offerId;
            Offer memory offer = getOffer(offerId);

            if (
                pricePerWorkerEpoch < offer.minPricePerWorkerEpoch || paymentToken != offer.paymentToken
                    || !_hasOfferEffectors(offerId, effectors)
            ) {
                continue;
            }

            // TODO: check peer in capacity commitment
            // TODO: check max peers per provider

            _mvComputeUnitToDeal(computeUnitId, deal);
            // TODO: only for NOX -- remove in future
            emit ComputeUnitMatched(peerId, computeUnitId, creationBlock, appCID);
            freeWorkerSlotsCurrent--;

            if (!isDealMatched) {
                isDealMatched = true;
            }

            if (freeWorkerSlotsCurrent == 0) {
                // TODO: possible feature of signalling to user that matched fully.
                break;
            }
        }

        uint minWorkers = deal.minWorkers();
        if (minWorkers > dealComputeUnitCount + freeWorkerSlots - freeWorkerSlotsCurrent) revert minWorkersNotMatchedError(minWorkers);

        if (isDealMatched) {
            _getMatcherStorage().lastMatchedEpoch[address(deal)] = currentEpoch;
        }
    }
}
