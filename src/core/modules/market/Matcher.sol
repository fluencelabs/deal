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

abstract contract Matcher is Offer, IMatcher {
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
    /**
     * @notice Match deal with offers and compute units (peers checks through compute units).
     * @dev There should be `bytes32[][] calldata peers` as well, but it is not supported by subgraph codegen.
     * @dev  Ref to https://github.com/graphprotocol/graph-tooling/issues/342.
     * @param deal Deal to match.
     * @param offers Offers to match with.
     * @param computeUnits Compute units to match with.
     */
    function matchDeal(IDeal deal, bytes32[] calldata offers, bytes32[][] calldata computeUnits) external {
        ICapacity capacity = core.capacity();
        MatcherStorage storage matcherStorage = _getMatcherStorage();

        uint256 lastMatchedEpoch = matcherStorage.lastMatchedEpoch[address(deal)];
        uint256 currentEpoch = core.currentEpoch();
        require(
            lastMatchedEpoch == 0 || currentEpoch > lastMatchedEpoch + core.minDealRematchingEpoches(),
            "Matcher: too early to rematch"
        );

        uint256 pricePerWorkerEpoch = deal.pricePerWorkerEpoch();
        address paymentToken = address(deal.paymentToken());
        uint256 dealComputeUnitCount = deal.getComputeUnitCount();
        uint256 freeWorkerSlots = deal.targetWorkers() - dealComputeUnitCount;
        uint256 freeWorkerSlotsCurrent = freeWorkerSlots;
        CIDV1[] memory effectors = deal.effectors();

        CIDV1 memory appCID = deal.appCID();
        uint256 creationBlock = deal.creationBlock();

        bool isDealMatched = false;

        // Go through offers.
        for (uint256 i = 0; i < offers.length; ++i) {
            bytes32 offerId = offers[i];
            Offer memory offer = getOffer(offerId);
            if (
                pricePerWorkerEpoch < offer.minPricePerWorkerEpoch || paymentToken != offer.paymentToken
                    || !_hasOfferEffectors(offerId, effectors)
            ) {
                continue;
            }
            // Go through compute units.
            for (uint256 k = 0; k < computeUnits[i].length; ++k) {
                bytes32 computeUnitId = computeUnits[i][k];

                // Get CU and start checking, if smth wrong - skip.
                // It throws if CU does not exist.
                ComputeUnit memory computeUnit = getComputeUnit(computeUnitId);
                bytes32 peerId = computeUnit.peerId;
                ComputePeer memory peer = getComputePeer(peerId);

                // Check if no one tries to trick us with indexes of passed args.
                if (peer.offerId != offerId) {
                    continue;
                }

                // Check if CU available.
                if (computeUnit.deal != address(0) || peer.commitmentId == bytes32(0x000000000)) {
                    continue;
                }

                if (currentEpoch < capacity.getCommitment(peer.commitmentId).startEpoch) {
                    continue;
                }

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
        }

        uint256 minWorkers = deal.minWorkers();
        if (minWorkers > dealComputeUnitCount + freeWorkerSlots - freeWorkerSlotsCurrent) {
            revert minWorkersNotMatched(minWorkers);
        }

        if (isDealMatched) {
            _getMatcherStorage().lastMatchedEpoch[address(deal)] = currentEpoch;
        }
    }
}
