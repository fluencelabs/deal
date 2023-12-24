import { IndexerClient } from "./indexerClient/indexerClient.js";
import type { DealQueryQuery } from "./indexerClient/queries/deals-query.generated.js";
import type { ContractsENV } from "../client/config.js";

export interface GetMatchedOffersResult {
  computeUnits: Array<string>;
  fulfilled: boolean;
}

export class DealNotFoundError extends Error {}

// async getTotalProviders(variables?: ProvidersQueryQueryVariables, offset: number = 0): Promise<number> {
//   const paginatorVars: ProvidersQueryQueryVariables = { ...variables } || {};
//   paginatorVars.limit = this.PAGINATOR_ENITIES_LIMIT
//   paginatorVars.offset = offset
//
//   const entities = await this.providersClient.ProvidersIdQuery(paginatorVars);
//   const fetchedEntities = entities.providers.length
//   // Check if it should request more.
//   if (fetchedEntities == this.PAGINATOR_ENITIES_LIMIT) {
//     return fetchedEntities + await this.getTotalProviders(variables, offset + this.PAGINATOR_ENITIES_LIMIT)
//   }
//   return fetchedEntities
// }

export class DealMatcherClient {
  INDEXER_MAX_FIRST = 5;
  // TODO: private
  public _indexerClient: IndexerClient;
  constructor(network: ContractsENV) {
    this._indexerClient = new IndexerClient(network);
  }

  async _getMatchedOffersPage(
    pricePerWorkerEpoch: string,
    effectors: Array<string>,
    paymentToken: string,
    // targetWorkerSlotToMatch: number,
    // minWorkersToMatch: number,
    maxWorkersPerProvider: number,
    offersOffset: number = 0,
    peersOffset: number = 0,
    computeUnitsOffset: number = 0,
  ) {
    const fetched = await this._indexerClient.getOffers({
      limit: maxWorkersPerProvider,
      filters: {
        pricePerEpoch_lte: pricePerWorkerEpoch,
        effectors_: { effector_in: effectors },
        paymentToken: paymentToken,
        // Check if any of compute units are available in the offer.
        computeUnitsAvailable_gt: 0,
      },
      peersFilters: { computeUnits_: { deal: null } },
      computeUnitsFilters: { deal: null },
      // Below is not the guarantee that query will be according to the maxWorkersPerProvider rule.
      // It merely shorten the query response for that rule.
      // TODO: add guarantee into the code. (resolve after on contract is resolved).
      peersLimit: maxWorkersPerProvider,
      computeUnitsLimit: maxWorkersPerProvider,
      offset: offersOffset,
      peersOffset: peersOffset,
      computeUnitsOffset: computeUnitsOffset,
    });
    return fetched.offers;
  }

  // Should we check rematching epoch before?
  // Returns offers and compute units matched for the deal.
  async getMatchedOffers(
    pricePerWorkerEpoch: string,
    effectors: Array<string>,
    paymentToken: string,
    targetWorkerSlotToMatch: number,
    minWorkersToMatch: number,
    maxWorkersPerProvider: number,
  ): Promise<GetMatchedOffersResult> {
    console.group(
      "[getMatchedOffers] Try to match the next deal configuration with offers:",
    );
    console.info("pricePerWorkerEpoch = " + pricePerWorkerEpoch);
    console.info("effectors = " + JSON.stringify(effectors));
    console.info("paymentToken = " + paymentToken);
    console.info("targetWorkerSlotToMatch = " + targetWorkerSlotToMatch);
    console.info("minWorkersToMatch = " + minWorkersToMatch);

    // TODO.
    console.warn(
      `maxWorkersPerProvider = ${maxWorkersPerProvider} currently ignored.`,
    );

    if (targetWorkerSlotToMatch > this.INDEXER_MAX_FIRST) {
      console.warn(
        `targetWorkerSlotToMatch param is too high, it is better to reduce large query to ${this.INDEXER_MAX_FIRST} per batch.`,
      );
    }
    const matchedComputeUnitsData: GetMatchedOffersResult = {
      computeUnits: [],
      fulfilled: false,
    };

    // Go through indexer pages until the end condition: one of {fulfilled | end of offers, and peers, and CUs.}
    let offersLastPageReached = false;
    let peersLastPageReached = false;
    let computeUnitsLastPageReached = false;
    let offersOffset = 0;
    let peersOffset = 0;
    let computeUnitsOffset = 0;
    while (
      !(
        offersLastPageReached &&
        peersLastPageReached &&
        computeUnitsLastPageReached
      )
    ) {
      // Request page, but remember about indexer limit.
      let perPageLimit = targetWorkerSlotToMatch;
      if (targetWorkerSlotToMatch > this.INDEXER_MAX_FIRST) {
        perPageLimit = this.INDEXER_MAX_FIRST;
      }
      const offers = await this._getMatchedOffersPage(
        pricePerWorkerEpoch,
        effectors,
        paymentToken,
        // targetWorkerSlotToMatch,
        // minWorkersToMatch,
        perPageLimit,
        offersOffset,
        peersOffset,
        computeUnitsOffset,
      );

      // Analise fetched data.
      for (const offer of offers) {
        const peers = offer.peers;
        if (!peers) {
          continue;
        }

        for (const peer of peers) {
          const peerComputeUnits = peer.computeUnits;
          if (!peerComputeUnits) {
            continue;
          }

          for (const computeUnit of peerComputeUnits) {
            // Finally found free compute unit.
            matchedComputeUnitsData.computeUnits.push(computeUnit.id);

            // Check if we're still seeking for free compute units.
            // If yes - early return.
            if (
              matchedComputeUnitsData.computeUnits.length ==
              targetWorkerSlotToMatch
            ) {
              matchedComputeUnitsData.fulfilled = true;
              return matchedComputeUnitsData;
            }
          }

          // Have we reached the end for the compute units?
          if (peerComputeUnits.length < this.INDEXER_MAX_FIRST) {
            computeUnitsLastPageReached = true;
          } else {
            // Prepare to fetch next peer page.
            computeUnitsOffset += this.INDEXER_MAX_FIRST;
          }
        }

        // Only we reached the end for the compute units, we check the end for the peers.
        if (computeUnitsLastPageReached) {
          // Have we reached the end for the peer?
          if (peers.length < this.INDEXER_MAX_FIRST) {
            peersLastPageReached = true;
          } else {
            // Prepare to fetch next peer page.
            peersOffset += this.INDEXER_MAX_FIRST;
            computeUnitsOffset = 0;
            computeUnitsLastPageReached = false;
          }
        }
      }

      // Only we reached the end for the peer, we check the end for the offer.
      if (peersLastPageReached) {
        // Have we reached the end of offers?
        if (offers.length < this.INDEXER_MAX_FIRST) {
          offersLastPageReached = true;
        } else {
          // Prepare to fetch the next offer page.
          offersOffset += this.INDEXER_MAX_FIRST;
          peersOffset = 0;
          peersLastPageReached = false;
          computeUnitsOffset = 0;
          computeUnitsLastPageReached = false;
        }
      }
    }

    if (minWorkersToMatch > matchedComputeUnitsData.computeUnits.length) {
      console.warn(
        "Transaction will be failed because minWorkersToMatch > matchedComputeUnits. Return [].",
      );
      matchedComputeUnitsData.computeUnits = [];
    }
    console.groupEnd();
    return matchedComputeUnitsData;
  }

  async getMatchedOffersByDeal(
    dealId: string,
  ): Promise<GetMatchedOffersResult> {
    const data: DealQueryQuery = await this._indexerClient.getDeal({
      id: dealId,
    });
    if (!data.deal) {
      throw new DealNotFoundError(dealId);
    }

    const deal = data.deal;
    const dealTargetWorkers = deal.targetWorkers;
    const minWorkers = deal.minWorkers;
    const alreadyMatchedComputeUnits = deal.addedComputeUnits?.length || 0;
    const targetWorkerToMath = dealTargetWorkers - alreadyMatchedComputeUnits;
    let minWorkersToMatch = minWorkers - alreadyMatchedComputeUnits;
    if (minWorkersToMatch < 0) {
      minWorkersToMatch = 0;
    }

    if (!deal.effectors) {
      throw new Error("Assert: deal: " + dealId + " has no effectors.");
    }
    return await this.getMatchedOffers(
      deal.pricePerWorkerEpoch as string,
      deal.effectors.map((effector) => {
        return effector.effector.id;
      }),
      deal.paymentToken.id,
      targetWorkerToMath,
      minWorkersToMatch,
      deal.maxWorkersPerProvider,
    );
  }
}
