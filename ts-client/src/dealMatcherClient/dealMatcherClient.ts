import { IndexerClient } from "./indexerClient/indexerClient.js";
import type { ContractsENV } from "../client/config.js";
import type { OffersQueryQueryVariables } from "./indexerClient/queries/offers-query.generated.js";

// Structure match matchDeal() arguments.
// Currently: bytes32[] calldata offers, bytes32[][] calldata computeUnits.
export interface GetMatchedOffersOut {
  offers: Array<string>;
  computeUnitsPerOffers: Array<Array<string>>;
  fulfilled: boolean;
}

export interface GetMatchedOffersIn {
  dealId: string;
  pricePerWorkerEpoch: string;
  effectors: Array<string>;
  paymentToken: string;
  targetWorkerSlotToMatch: number;
  minWorkersToMatch: number;
  maxWorkersPerProvider: number;
  currentEpoch: number;
}

export class DealNotFoundError extends Error {
  public static DEAL_NOT_FOUND_ERROR_PREFIX = "Deal not found. Searched for:";
  constructor(dealId: string) {
    super(DealNotFoundError.DEAL_NOT_FOUND_ERROR_PREFIX + " " + dealId);
    Object.setPrototypeOf(this, DealNotFoundError.prototype);
  }
}

export class DealMatcherClient {
  private _indexerClient: IndexerClient;
  public MAX_PER_PAGE: number;
  /*
   * @param network - network name: {kras/stage/...}.
   * @param indexerUrl - indexer url (if you want to manually set url for the indexer to use).
   */
  constructor(network?: ContractsENV, indexerUrl?: string) {
    this._indexerClient = new IndexerClient(network, indexerUrl);
    this.MAX_PER_PAGE = this._indexerClient.INDEXER_MAX_FIRST;
  }

  // Represents the way to query indexer for available compute units (subgraph).
  // CU are available if CU are allowed for the matchDeal
  //  (ref to https://github.com/fluencelabs/deal/blob/main/src/core/modules/market/Matcher.sol#L48).
  async _getMatchedOffersPage(
    getMatchedOffersIn: GetMatchedOffersIn,
    offersPerPageLimit: number, // Possibility to optimise query size.
    peersPerPageLimit: number, // Possibility to control, e.g. maxWorkersPerProvider.
    offersOffset: number = 0,
    peersOffset: number = 0,
    computeUnitsOffset: number = 0,
  ) {
    const currentEpochString = getMatchedOffersIn.currentEpoch.toString();
    // Some filters per peers, capacity commitments and compute units are copied
    //  and implemented with different fields for the same filtration - it is so
    //  in major because in subgraph it is impossible to filter on nested fields
    //  and we do not want to reduce fetched data size (e.g. do to fetch offers
    //  with no peers with our conditions)
    const indexerGetOffersParams: OffersQueryQueryVariables = {
      limit: offersPerPageLimit,
      filters: {
        // TODO: We do not need Offers with ALL peers already linked to the Deal (protocol restriction).
        pricePerEpoch_lte: getMatchedOffersIn.pricePerWorkerEpoch,
        paymentToken: getMatchedOffersIn.paymentToken.toLowerCase(),
        // Check if any of compute units are available in the offer and do not even fetch unrelated offers.
        computeUnitsAvailable_gt: 0,
        // Do not fetch peers with no any of compute units in "active" status at all.
        // Check if CU status is Active - if it has current capacity commitment and
        //  cc.info.startEpoch <= currentEpoch_.
        peers_: {
          currentCapacityCommitment_not: null,
          // Since it is not possible to filter by currentCapacityCommitment_.startEpoch_lt
          //  we use this help field.
          collateralDepositedAt_lt: currentEpochString,
          // TODO: optimise query - mirror endEpoch check
          // TODO: optimise query - mirror nextCCFailedEpoch check
        },
      },
      peersFilters: {
        and: [
          {
            computeUnits_: { deal: null },
            // Check if CU status is Active - if it has current capacity commitment and
            //  cc.info.startEpoch <= currentEpoch_.
            currentCapacityCommitment_not: null,
            currentCapacityCommitment_: {
              startEpoch_lte: currentEpochString,
              endEpoch_gt: currentEpochString,
              // On each submitProof indexer should save nextCCFailedEpoch, and
              //  in query we relay on that field to filter Failed CC.
              nextCCFailedEpoch_gt: currentEpochString,
            },
          },
          {
            // We do not need peers that already linked to the Deal (protocol restriction).
            or: [
              {
                joinedDeals_: {
                  deal_not: getMatchedOffersIn.dealId,
                },
              },
              {
                isAnyJoinedDeals: false,
              },
            ],
          },
        ],
      },
      computeUnitsFilters: { deal: null },
      peersLimit: peersPerPageLimit,
      // We do not need more than 1 CU per peer. Apply restriction to already fetched and filtered data.
      computeUnitsLimit: 1,
      offset: offersOffset,
      peersOffset: peersOffset,
      computeUnitsOffset: computeUnitsOffset,
    };
    if (getMatchedOffersIn.effectors.length > 0) {
      indexerGetOffersParams.filters!["effectors_"] = {
        effector_in: getMatchedOffersIn.effectors,
      };
    }
    console.info(
      `[_getMatchedOffersPage] Requesting indexer for page with page params: ${JSON.stringify(
        indexerGetOffersParams,
        null,
        2,
      )}...`,
    );
    const fetched = await this._indexerClient.getOffers(indexerGetOffersParams);
    console.info(`[_getMatchedOffersPage] Got response from indexer.`);
    console.debug(
      `[_getMatchedOffersPage] Fetched data: ${JSON.stringify(
        fetched,
        null,
        2,
      )}`,
    );
    return fetched.offers;
  }

  // It requests indexer page by page until it fullfils the getMatchedOffersIn
  //  config or until reached the end of potentially matched compute units.
  async getMatchedOffers(
    getMatchedOffersIn: GetMatchedOffersIn,
  ): Promise<GetMatchedOffersOut> {
    const {
      targetWorkerSlotToMatch,
      minWorkersToMatch,
      maxWorkersPerProvider,
    } = getMatchedOffersIn;
    console.group(
      "[getMatchedOffers] Try to find matched offers with the next deal configuration:",
    );
    console.info(JSON.stringify(getMatchedOffersIn, null, 2));

    if (targetWorkerSlotToMatch > this.MAX_PER_PAGE) {
      console.warn(
        `targetWorkerSlotToMatch param is too high, it is better to reduce large query to ${this.MAX_PER_PAGE} per batch.`,
      );
    }
    const matchedComputeUnitsData: GetMatchedOffersOut = {
      offers: [],
      computeUnitsPerOffers: [],
      fulfilled: false,
    };
    const offerToOfferCursor: { [id: string]: number } = {};
    let computeUnitsMatchedTotal = 0;

    // Go through indexer pages until the end condition: one of {fulfilled | end of offers, and peers, and CUs.}
    let offersLastPageReached = false;
    let peersLastPageReached = false;
    let computeUnitsLastPageReached = false;
    let offersOffset = 0;
    let peersOffset = 0;
    let computeUnitsOffset = 0;
    // We do not need more than 1 CU per peer. Apply restriction to already fetched and filtered data.
    let peersOfMatchedComputeUnits: Set<string> = new Set();
    while (
      !(
        offersLastPageReached &&
        peersLastPageReached &&
        computeUnitsLastPageReached
      )
    ) {
      // Request page as big as allowed (remember about indexer limit).
      // Shortens the query response for that rule as additional query size optimisation.
      let offersPerPageLimit = targetWorkerSlotToMatch;
      if (offersPerPageLimit > this.MAX_PER_PAGE) {
        offersPerPageLimit = this.MAX_PER_PAGE;
      }
      let peersPerPageLimit = maxWorkersPerProvider;
      // Request page of peers and CUs as big as allowed (remember about indexer limit).
      if (peersPerPageLimit > this.MAX_PER_PAGE) {
        peersPerPageLimit = this.MAX_PER_PAGE;
      }
      const offers = await this._getMatchedOffersPage(
        getMatchedOffersIn,
        offersPerPageLimit,
        peersPerPageLimit,
        offersOffset,
        peersOffset,
        computeUnitsOffset,
      );

      if (offers.length == 0) {
        console.debug("Got empty data from indexer, break search.");
        break;
      }

      // Analise fetched data to understand if we need to fetch next page and what
      //  params {offset, ...} to use for the next page.
      for (const offer of offers) {
        // Get the offer cursor to save compute units accordingly.
        let offerCursor = 0;
        const offerId = offer.id;
        if (offerId in offerToOfferCursor) {
          offerCursor = offerToOfferCursor[offerId] as number;
        } else {
          offerCursor = matchedComputeUnitsData.offers.length;
          offerToOfferCursor[offerId] = offerCursor;
          matchedComputeUnitsData.offers.push(offerId);
        }
        const peers = offer.peers;
        console.log("TODO: peers", peers);
        // Check if peers are empty and need to fetch next offer page.
        //  It could happen because we have after fetch filter: not more than 1 CU per peer
        //  that filters
        if (!peers || peers.length == 0) {
          offersOffset += this.MAX_PER_PAGE;
          peersOffset = 0;
          peersLastPageReached = false;
          computeUnitsOffset = 0;
          computeUnitsLastPageReached = false;
          break;
        }

        for (const peer of peers) {
          const peerComputeUnits = peer.computeUnits;
          if (!peerComputeUnits) {
            continue;
          }

          for (const computeUnit of peerComputeUnits) {
            // Break if CU from the peer already chosen.
            if (peersOfMatchedComputeUnits.has(peer.id)) {
              break;
            }

            peersOfMatchedComputeUnits.add(peer.id);
            computeUnitsMatchedTotal += 1;

            if (
              matchedComputeUnitsData.computeUnitsPerOffers.length <=
              offerCursor
            ) {
              matchedComputeUnitsData.computeUnitsPerOffers.push([
                computeUnit.id,
              ]);
            } else {
              const computeUnitsPerOffers =
                matchedComputeUnitsData.computeUnitsPerOffers[offerCursor];
              if (computeUnitsPerOffers === undefined) {
                throw new Error(
                  `Assertion failed: computeUnitsPerOffers is undefined for offerCursor = ${offerCursor}.
                  The data structure is broken: ${matchedComputeUnitsData.computeUnitsPerOffers}.`,
                );
              }
              computeUnitsPerOffers.push(computeUnit.id);
            }

            // Check if we're still seeking for free compute units.
            // If already found all - early return.
            if (computeUnitsMatchedTotal == targetWorkerSlotToMatch) {
              matchedComputeUnitsData.fulfilled = true;
              return matchedComputeUnitsData;
            }
          }

          // Have we reached the end for the compute units?
          if (peerComputeUnits.length < this.MAX_PER_PAGE) {
            computeUnitsLastPageReached = true;
          } else {
            // Prepare to fetch next CU page.
            computeUnitsOffset += this.MAX_PER_PAGE;
          }
        }

        // Only if we reaches the end for the compute units, we check the end for the peers.
        if (computeUnitsLastPageReached) {
          // Have we reached the end for the peer?
          if (peers.length < this.MAX_PER_PAGE) {
            peersLastPageReached = true;
          } else {
            // Prepare to fetch next peer page.
            peersOffset += this.MAX_PER_PAGE;
            computeUnitsOffset = 0;
            computeUnitsLastPageReached = false;
          }
        }
      }

      // Only if we reach the end for the peer, we check the end for the offer.
      if (peersLastPageReached) {
        // Have we reached the end of offers?
        if (offers.length < this.MAX_PER_PAGE) {
          offersLastPageReached = true;
        } else {
          // Prepare to fetch the next offer page.
          offersOffset += this.MAX_PER_PAGE;
          peersOffset = 0;
          peersLastPageReached = false;
          computeUnitsOffset = 0;
          computeUnitsLastPageReached = false;
        }
      }
    }

    if (minWorkersToMatch > computeUnitsMatchedTotal) {
      console.warn(
        "Transaction will be failed because minWorkersToMatch > matchedComputeUnits. Return [].",
      );
      matchedComputeUnitsData.offers = [];
      matchedComputeUnitsData.computeUnitsPerOffers = [];
    }
    console.groupEnd();
    return matchedComputeUnitsData;
  }

  // TODO: mb relocate to Deal contract class (utils extention)?
  // It mirrors `function currentEpoch() public view returns (uint256)`.
  calculateEpoch(
    timestamp: number,
    epochControllerStorageInitTimestamp: number,
    epochControllerStorageEpochDuration: number,
  ) {
    return Math.floor(
      1 +
        (timestamp - epochControllerStorageInitTimestamp) /
          epochControllerStorageEpochDuration,
    );
  }

  /**
   * Get compute units and their offers to match provided DealId (address).
   * Notice, current structure should match matchDeal(..., offers, computeUnits)
   *  contract arguments.
   *
   * 1. Fetches the deal and its configuration from the Indexer backend
   * 2. Scraps compute units (page by page) until one of the conditions:
   * - the end of matched offers/peers/compute units
   * - all target compute units found.
   */
  async getMatchedOffersByDealId(dealId: string): Promise<GetMatchedOffersOut> {
    const { deal, _meta, graphNetworks } = await this._indexerClient.getDeal({
      id: dealId.toLowerCase(),
    });
    if (!deal) {
      throw new DealNotFoundError(dealId);
    }
    if (
      graphNetworks.length == 0 ||
      graphNetworks[0]?.coreEpochDuration == null ||
      _meta?.block.timestamp == null
    ) {
      throw new Error(
        `Inconsistent states of the Subgraph: server error. Retry later.`,
      );
    }
    const alreadyMatchedComputeUnits = deal.addedComputeUnits?.length ?? 0;
    const targetWorkerToMath = deal.targetWorkers - alreadyMatchedComputeUnits;
    const minWorkersToMatch = Math.max(
      deal.minWorkers - alreadyMatchedComputeUnits,
      0,
    );
    if (deal.effectors == null) {
      throw new Error(`Effectors of a deal: ${dealId} are null - assert.`);
    }
    return await this.getMatchedOffers({
      dealId: dealId,
      // TODO: after migrate to another indexer, rm as string.
      pricePerWorkerEpoch: deal.pricePerWorkerEpoch as string,
      effectors: deal.effectors.map((effector) => {
        return effector.effector.id;
      }),
      paymentToken: deal.paymentToken.id,
      targetWorkerSlotToMatch: targetWorkerToMath,
      minWorkersToMatch: minWorkersToMatch,
      maxWorkersPerProvider: deal.maxWorkersPerProvider,
      currentEpoch: this.calculateEpoch(
        _meta.block.timestamp,
        Number(graphNetworks[0].initTimestamp),
        graphNetworks[0].coreEpochDuration,
      ),
    });
  }
}
