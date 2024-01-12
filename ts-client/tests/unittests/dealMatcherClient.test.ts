import { describe, expect, test, vi } from "vitest";
import { DealMatcherClient } from "../../src";
import {
  IndexerClient
} from "../../src/dealMatcherClient/indexerClient/indexerClient";
import { ethers } from "ethers";
import {
  OffersQueryQuery
} from "../../src/dealMatcherClient/indexerClient/queries/offers-query.generated";

async function createRandomIndexerOffersData(offers: number, peers: number, computeUnits: number): Promise<OffersQueryQuery> {
  let offersData: OffersQueryQuery = { offers: [] }
  for (let i = 0; i < offers; i++) {
    let createdPeers = []
    for (let j = 0; j < peers; j++) {
      let createdComputeUnits = []
      for (let k = 0; k < computeUnits; k++) {
        createdComputeUnits.push(
          {
            id: ethers.hexlify(ethers.randomBytes(32)),
          }
        )
      }
      createdPeers.push(
        {
          computeUnits: createdComputeUnits,
        }
      )
    }
    offersData.offers.push(
      {
        id: ethers.hexlify(ethers.randomBytes(32)),
        peers: createdPeers
      }
    )
  }
  return offersData
}

vi.mock("./indexerClient/indexerClient.js", () => {
  const IndexerClient = vi.fn()
  IndexerClient.prototype.getOffers = vi.fn()
  return { IndexerClient }
})

const TEST_NETWORK = 'local'

interface CallImplProps {
  targetWorkerSlotToMatch: number,
  minWorkersToMatch: number,
  offersMockedPage1: number,
  peersMockedPage1: number,
  CUsMockedPage1: number,
  offersMockedPage2: number,
  peersMockedPage2: number,
  CUsMockedPage2: number,
  expectedCU: number,
  expectedOffers: number
  exceptedIndexerCalls: number,
  expectedFulfilled: boolean
}

describe('#getMatchedOffers', () => {
  async function _callImpl(callImplProps: CallImplProps) {
    const _getMatchedOffersPageSpy = vi.spyOn(DealMatcherClient.prototype, '_getMatchedOffersPage')
    const client = new DealMatcherClient(TEST_NETWORK)
    const data = createRandomIndexerOffersData(callImplProps.offersMockedPage1, callImplProps.peersMockedPage1, callImplProps.CUsMockedPage1)
    // TODO: add possibility to add compute units to the same offer.
    const data2 = createRandomIndexerOffersData(callImplProps.offersMockedPage2, callImplProps.peersMockedPage2, callImplProps.CUsMockedPage2)
    IndexerClient.prototype.getOffers = vi.fn().mockReturnValueOnce(data).mockReturnValueOnce(data2)

    const pricePerWorkerEpoch = "1"
    const effectors = ['foo']
    const paymentToken = "foo"
    const maxWorkersPerProvider = 1

    const matchedOffers = await client.getMatchedOffers(
      {
        pricePerWorkerEpoch: pricePerWorkerEpoch,
        effectors: effectors,
        paymentToken: paymentToken,
        targetWorkerSlotToMatch: callImplProps.targetWorkerSlotToMatch,
        minWorkersToMatch: callImplProps.minWorkersToMatch,
        maxWorkersPerProvider: maxWorkersPerProvider,
      }
    )

    expect(_getMatchedOffersPageSpy.mock.calls.length).toEqual(callImplProps.exceptedIndexerCalls)
    expect(matchedOffers.fulfilled).toEqual(callImplProps.expectedFulfilled)
    let total = 0;
    for (const computeUnits of matchedOffers.computeUnitsPerOffers) {
      total += computeUnits.length
    }
    expect(total).toEqual(callImplProps.expectedCU)
    expect(matchedOffers.offers.length).toEqual(callImplProps.expectedOffers)
  }

  test(`It returns exact CUs when indexer has offers less than MAX_PER_PAGE`, async () => {
    await _callImpl(
      {
        targetWorkerSlotToMatch: 1,
        minWorkersToMatch: 1,
        offersMockedPage1: 1,
        peersMockedPage1: 1,
        CUsMockedPage1: 1,
        offersMockedPage2: 0,
        peersMockedPage2: 0,
        CUsMockedPage2: 0,
        expectedCU: 1,
        exceptedIndexerCalls: 1,
        expectedFulfilled: true,
        expectedOffers: 1,
      }
    )
  })

  test(`It returns MAX_PER_PAGE when indexer has offers equal MAX_PER_PAGE`, async () => {
    const client = new DealMatcherClient(TEST_NETWORK)
    await _callImpl(
      {
        targetWorkerSlotToMatch: client.MAX_PER_PAGE,
        minWorkersToMatch: 1,
        offersMockedPage1: 1,
        peersMockedPage1: 1,
        offersMockedPage2: 0,
        peersMockedPage2: 0,
        CUsMockedPage2: 0,
        CUsMockedPage1: client.MAX_PER_PAGE,
        expectedCU: client.MAX_PER_PAGE,
        exceptedIndexerCalls: 1,
        expectedFulfilled: true,
        expectedOffers: 1,
      }
    )
  })

  test(`It calls indexer several times to find target CUs paginating through CUs.`, async () => {
    const client = new DealMatcherClient(TEST_NETWORK)
    await _callImpl(
      {
        targetWorkerSlotToMatch: client.MAX_PER_PAGE + 1,
        minWorkersToMatch: 1,
        offersMockedPage1: 1,
        peersMockedPage1: 1,
        CUsMockedPage1: client.MAX_PER_PAGE,
        offersMockedPage2: 1,
        peersMockedPage2: 1,
        CUsMockedPage2: 1,
        expectedCU: client.MAX_PER_PAGE + 1,
        exceptedIndexerCalls: 2,
        expectedFulfilled: true,
        expectedOffers: 2,
      }
    )
  })

  test(`It calls indexer several times to find target CUs paginating through Peers.`, async () => {
    const client = new DealMatcherClient(TEST_NETWORK)
    await _callImpl(
      {
        targetWorkerSlotToMatch: client.MAX_PER_PAGE + 1,
        minWorkersToMatch: 1,
        offersMockedPage1: 1,
        peersMockedPage1: client.MAX_PER_PAGE,
        CUsMockedPage1: 1,
        offersMockedPage2: 1,
        peersMockedPage2: 1,
        CUsMockedPage2: 1,
        expectedCU: client.MAX_PER_PAGE + 1,
        exceptedIndexerCalls: 2,
        expectedFulfilled: true,
        expectedOffers: 2,
      }
    )
  })

  test(`It calls indexer several times to find target CUs paginating through Offers.`, async () => {
    const client = new DealMatcherClient(TEST_NETWORK)
    await _callImpl(
      {
        targetWorkerSlotToMatch: client.MAX_PER_PAGE + 1,
        minWorkersToMatch: 1,
        offersMockedPage1: client.MAX_PER_PAGE,
        peersMockedPage1: 1,
        CUsMockedPage1: 1,
        offersMockedPage2: 1,
        peersMockedPage2: 1,
        CUsMockedPage2: 1,
        expectedCU: client.MAX_PER_PAGE + 1,
        exceptedIndexerCalls: 2,
        expectedFulfilled: true,
        expectedOffers: client.MAX_PER_PAGE + 1,
      }
    )
  })

  test(`It calls indexer 1 time even if not fulfilled, but reached the end.`, async () => {
    const client = new DealMatcherClient(TEST_NETWORK)
    await _callImpl(
      {
        targetWorkerSlotToMatch: client.MAX_PER_PAGE + 1,
        minWorkersToMatch: 1,
        offersMockedPage1: 1,
        peersMockedPage1: 1,
        CUsMockedPage1: client.MAX_PER_PAGE - 1,
        offersMockedPage2: 0,
        peersMockedPage2: 0,
        CUsMockedPage2: 0,
        expectedCU: client.MAX_PER_PAGE - 1,
        exceptedIndexerCalls: 1,
        expectedFulfilled: false,
        expectedOffers: 1,
      }
    )
  })

  test(`It returns [] if min workers is not reached`, async () => {
    await _callImpl(
      {
        targetWorkerSlotToMatch: 3,
        minWorkersToMatch: 2,
        offersMockedPage1: 1,
        peersMockedPage1: 1,
        CUsMockedPage1: 1,
        offersMockedPage2: 0,
        peersMockedPage2: 0,
        CUsMockedPage2: 0,
        expectedCU: 0,
        exceptedIndexerCalls: 1,
        expectedFulfilled: false,
        expectedOffers: 0
      }
    )
  })

  test(`It returns [] if nothing to match with`, async () => {
    await _callImpl(
      {
        targetWorkerSlotToMatch: 1,
        minWorkersToMatch: 1,
        offersMockedPage1: 0,
        peersMockedPage1: 0,
        CUsMockedPage1: 0,
        offersMockedPage2: 0,
        peersMockedPage2: 0,
        CUsMockedPage2: 0,
        expectedCU: 0,
        exceptedIndexerCalls: 1,
        expectedFulfilled: false,
        expectedOffers: 0
      }
    )
  })
})
