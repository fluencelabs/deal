// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IMatcher.sol";
import "src/deal/interfaces/IDeal.sol";
import "src/deal/interfaces/IConfig.sol";
import "./Offer.sol";
import {LibEpochController} from "src/lib/LibEpochController.sol";
import {LibOffer} from "src/lib/LibOffer.sol";
import {LibMatcher, MatcherStorage} from "src/lib/LibMatcher.sol";
import {LibCapacity} from "src/lib/LibCapacity.sol";

abstract contract Matcher is Offer, IMatcher {
    using SafeERC20 for IERC20;


    // ----------------- External Mutable -----------------
    /**
     * @dev Match Deal with Compute Units provided.
     * @notice Match deal with offers and compute units (peers checks through compute units).
     * @notice It validates provided CUs and silently ignore unvalidated ones on checking:
     * @notice - deal.maxWorkersPerProvider and silently ignore other CUs out of this limit.
     * @notice - Offer, or Peer not allowed to match (deal.isProviderAllowed, allowed prices, paymentToken, effectors)
     * @notice - Compute Unit (CU): Active CC status, also note, protocol does not allow more than one CU per peer
     * @notice    for the same Deal. But, when deal consists of whitelisted provider - CUs of this Provider
     * @notice    could be matched without even CC.
     * @notice TODO: consolidate workaround: when it comes to check CC status, on wrong status the whole transaction
     * @notice  will be failed instead of to be silenced.
     * @dev There should be `bytes32[][] calldata peers` as well, but it is not supported by subgraph codegen.
     * @dev  Ref to https://github.com/graphprotocol/graph-tooling/issues/342.
     * @notice This method is mirrored in ts-client/src/dealMatcherClient/dealMatcherClient.ts.
     * @param deal: Deal to match.
     * @param offers: Offers array that represents offers  in computeUnits 2D array.
     * @param computeUnits: Compute Units per offer id (2D array) to match with.
     */
    function matchDeal(IDeal deal, bytes32[] calldata offers, bytes32[][] calldata computeUnits) external {
        MatcherStorage storage matcherStorage = LibMatcher.store();

        require(OwnableUpgradableDiamond(address(deal)).owner() == msg.sender, "Matcher: sender is not deal owner");

        IDeal.Status dealStatus = deal.getStatus();
        require(
            dealStatus == IDeal.Status.ACTIVE || dealStatus == IDeal.Status.NOT_ENOUGH_WORKERS,
            "Matcher: deal is not active"
        );

        uint256 lastMatchedEpoch = matcherStorage.lastMatchedEpoch[address(deal)];
        uint256 currentEpoch = LibEpochController.currentEpoch();
        require(
            lastMatchedEpoch == 0 || currentEpoch > lastMatchedEpoch + core.minDealRematchingEpochs(),
            "Matcher: too early to rematch"
        );

        uint256 pricePerWorkerEpoch = deal.pricePerWorkerEpoch();
        address paymentToken = address(deal.paymentToken());
        uint256 dealComputeUnitCount = deal.getComputeUnitCount();
        uint256 freeWorkerSlots = deal.targetWorkers() - dealComputeUnitCount;
        uint256 freeWorkerSlotsCurrent = freeWorkerSlots;
        uint256 maxWorkersPerProvider = deal.maxWorkersPerProvider();
        uint256 protocolVersion = deal.getProtocolVersion();
        CIDV1[] memory effectors = deal.effectors();

        CIDV1 memory appCID = deal.appCID();
        uint256 creationBlock = deal.creationBlock();
        IConfig.AccessType providersAccessType = deal.providersAccessType();

        bool isDealMatched = false;

        // Go through offers.
        for (uint256 i = 0; i < offers.length; ++i) {
            bytes32 offerId = offers[i];
            Offer memory offer = getOffer(offerId);

            if (
                // Check for blacklisted provider and others.
                !deal.isProviderAllowed(offer.provider) || pricePerWorkerEpoch < offer.minPricePerWorkerEpoch
                    || paymentToken != offer.paymentToken || !LibOffer._hasOfferEffectors(offerId, effectors)
                    || offer.minProtocolVersion > protocolVersion || offer.maxProtocolVersion < protocolVersion
            ) {
                continue;
            }

            // To validate that match will be not more than with maxWorkersPerProvider CUs.
            uint256 computeUnitCountInDealByProvider = deal.getComputeUnitCount(offer.provider);

            // Go through compute units.
            for (uint256 k = 0; k < computeUnits[i].length; ++k) {
                if (computeUnitCountInDealByProvider > maxWorkersPerProvider || freeWorkerSlotsCurrent == 0) {
                    break;
                }

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
                if (
                    // Blacklisted provider we filtered out above via: !deal.isProviderAllowed(offer.provider).
                    providersAccessType != IConfig.AccessType.WHITELIST
                        && (
                            computeUnit.deal != address(0) || peer.commitmentId == bytes32(0x000000000)
                                || LibCapacity.getStatus(peer.commitmentId) != ICapacity.CCStatus.Active
                        )
                ) {
                    continue;
                }

                // Currently, protocol does not allow more than one CU per peer for the same Deal.
                if (deal.isComputePeerExist(peerId)) {
                    continue;
                }

                LibOffer._mvComputeUnitToDeal(computeUnitId, deal);

                emit ComputeUnitMatched(peerId, deal, computeUnitId, creationBlock, appCID);

                computeUnitCountInDealByProvider++;
                freeWorkerSlotsCurrent--;

                if (!isDealMatched) {
                    isDealMatched = true;
                }
            }
        }

        uint256 minWorkers = deal.minWorkers();
        if (minWorkers > dealComputeUnitCount + freeWorkerSlots - freeWorkerSlotsCurrent) {
            revert MinWorkersNotMatched(minWorkers);
        }

        if (isDealMatched) {
            LibMatcher.store().lastMatchedEpoch[address(deal)] = currentEpoch;
        }
    }
}
