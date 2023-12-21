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
  private _indexerClient: IndexerClient;
  constructor(network: ContractsENV) {
    this._indexerClient = new IndexerClient(network)
  }

  // Should we check rematching epoch before?
  // Returns offers and compute units matched for the deal.
  // TODO: on contract maxWorkersPerProvider was ignored.
  async getMatchedOffers(
    pricePerWorkerEpoch: string,
    effectors: Array<string>,
    paymentToken: string,
    targetWorkerSlotToMatch: number,
  ): Promise<GetMatchedOffersResult> {
    console.info('[getMatchedOffers] Try to match the next deal configuration with offers:')
    console.info('pricePerWorkerEpoch = ' + pricePerWorkerEpoch)
    console.info('effectors = ' + JSON.stringify(effectors))
    console.info('paymentToken = ' + paymentToken)
    console.info('targetWorkerSlotToMatch = ' + targetWorkerSlotToMatch)

    const availableOffers = await this._indexerClient.getOffers(
      {
        filters: {
          pricePerEpoch_lte: pricePerWorkerEpoch,
          effectors_: {effector_in: effectors},
          paymentToken: paymentToken,
          // Check if any of compute units are available in the offer.
          computeUnitsAvailable_gt: 0,
        }
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
            return matchedComputeUnits
          }
        }
      }
    }
    return matchedComputeUnits
  }

  async getMatchedOffersByDeal(dealId: string): Promise<GetMatchedOffersResult> {
    const data: DealQueryQuery= await this._indexerClient.getDeal({id: dealId})
    if (!data.deal) {
      throw new DealNotFoundError(dealId)
    }

    const deal = data.deal
    const targetWorkerToMath = deal.targetWorkers
    if (!deal.effectors) {
      throw new Error("Assert: deal: " + dealId + " has no effectors.")
    }
    return await this.getMatchedOffers(
      deal.pricePerWorkerEpoch as string,
      deal.effectors.map(effector => {return effector.effector.id}),
      deal.paymentToken.id,
      targetWorkerToMath,
    )
  }
}
