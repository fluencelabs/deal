import {
  IndexerClient
} from "./indexerClient/indexerClient.js";
import type {
  DealQueryQuery
} from "./indexerClient/queries/deals-query.generated.js";
import type {ContractsENV} from "../client/config.js";

export interface GetMatchedOffersResult {
  computeUnits: Array<string>
  fulfilled: boolean,
}

export class DealNotFoundError extends Error {}

export class DealMatcherClient {
  INDEXER_MAX_FIRST = 1000
  private _indexerClient: IndexerClient;
  constructor(network: ContractsENV) {
    this._indexerClient = new IndexerClient(network)
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
    console.group('[getMatchedOffers] Try to match the next deal configuration with offers:')
    console.info('pricePerWorkerEpoch = ' + pricePerWorkerEpoch)
    console.info('effectors = ' + JSON.stringify(effectors))
    console.info('paymentToken = ' + paymentToken)
    console.info('targetWorkerSlotToMatch = ' + targetWorkerSlotToMatch)
    console.info('minWorkersToMatch = ' + minWorkersToMatch)

    // if (maxWorkersPerProvider > this.INDEXER_MAX_FIRST) {
    //   console.warn(
    //     `maxWorkersPerProvider param is too high, it will be reduced to ${this.INDEXER_MAX_FIRST}. Create another batch`)
    // }

    const availableOffers = await this._indexerClient.getOffers(
      {
        limit: maxWorkersPerProvider,
        filters: {
          pricePerEpoch_lte: pricePerWorkerEpoch,
          effectors_: {effector_in: effectors},
          paymentToken: paymentToken,
          // Check if any of compute units are available in the offer.
          computeUnitsAvailable_gt: 0,
        },
        peersFilters: {computeUnits_: {deal: null}},
        computeUnitsFilters: {deal: null},
        // Below is not the guarantee that query will be according to the maxWorkersPerProvider rule.
        // It merely shorten the query response for that rule.
        // TODO: add guarantee into the code. (resolve after on contract is resolved).
        peersLimit: maxWorkersPerProvider,
        computeUnitsLimit: maxWorkersPerProvider,
      }
    )

    const matchedComputeUnits: GetMatchedOffersResult = {computeUnits: [], fulfilled: false}
    const offers = availableOffers.offers
    for (const offer of offers) {
      if (!offer.peers) {
        continue
      }

      for (const peer of offer.peers) {
        if (!peer.computeUnits) {
          continue
        }

        for (const computeUnit of peer.computeUnits) {
          // Finally found free compute unit.
          matchedComputeUnits.computeUnits.push(computeUnit.id)

          // Check if we're still seeking for free compute units.
          if (matchedComputeUnits.computeUnits.length == targetWorkerSlotToMatch) {
            matchedComputeUnits.fulfilled = true;
            console.groupEnd();
            return matchedComputeUnits
          }
        }
      }
    }

    if (minWorkersToMatch > matchedComputeUnits.computeUnits.length) {
      console.warn("Transaction will be failed because minWorkersToMatch > matchedComputeUnits. Return [].")
      matchedComputeUnits.computeUnits = []
    }
    console.groupEnd();
    return matchedComputeUnits
  }

  async getMatchedOffersByDeal(dealId: string): Promise<GetMatchedOffersResult> {
    const data: DealQueryQuery= await this._indexerClient.getDeal({id: dealId})
    if (!data.deal) {
      throw new DealNotFoundError(dealId)
    }

    const deal = data.deal
    const dealTargetWorkers = deal.targetWorkers
    const minWorkers = deal.minWorkers as number
    const alreadyMatchedComputeUnits = deal.addedComputeUnits?.length || 0
    const targetWorkerToMath = dealTargetWorkers - alreadyMatchedComputeUnits
    let minWorkersToMatch = minWorkers - alreadyMatchedComputeUnits
    if (minWorkersToMatch < 0) {
      minWorkersToMatch = 0
    }

    if (!deal.effectors) {
      throw new Error("Assert: deal: " + dealId + " has no effectors.")
    }
    return await this.getMatchedOffers(
      deal.pricePerWorkerEpoch as string,
      deal.effectors.map(effector => {return effector.effector.id}),
      deal.paymentToken.id,
      targetWorkerToMath,
      minWorkersToMatch,
      deal.maxWorkersPerProvider,
    )
  }
}
