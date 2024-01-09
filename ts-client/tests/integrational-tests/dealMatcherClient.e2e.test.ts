// International tests for e2e:
// - deployed contracts
// - subgraph indexes contracts
// - it creates offers/deals
// - it finds match via subgraph client
// - it send mathcDeal tx.
// TODO: more variatives.
import {describe, test, expect} from "vitest";

import {ContractsENV, DealClient, DealMatcherClient} from "../../src";
import {ethers} from "ethers";

// TODO: from env.
const TEST_NETWORK: ContractsENV = "local";
const TEST_RPC_URL = "http://localhost:8545";
const DEFAULT_SUBGRAPH_TIME_INDEXING = 10000;
const DEFAULT_CONFIRMATIONS = 1;
const TESTS_TIMEOUT = 70000;

async function getDefaultOfferFixture(owner: string, paymentToken: string, timestamp: number) {
  const offerFixture = {
    minPricePerWorkerEpoch: ethers.parseEther("0.01"),
    paymentToken: paymentToken,
    effectors: [{prefixes: "0x12345678", hash: ethers.encodeBytes32String("Dogu")}],
    peers: [{
      peerId: ethers.encodeBytes32String(`peerId0:${timestamp}`),
      unitIds: [ethers.encodeBytes32String(`unitId0:${timestamp}`)],

      owner: owner,
    }],
  }
  return {offerFixture}
}

const provider = new ethers.JsonRpcProvider(TEST_RPC_URL);

/*
 * e2e test with dependencies:
 * - locally deployed contracts,
 * - integrated indexer to the deployed contracts.
 * Notice: snapshot is not going to work correctly since we connect indexer to the chain as well.
 */
describe('#getMatchedOffersByDealId', () => {
  // TODO: check that infra is running.
  async function createOffer(signer: ethers.Signer, timestamp: number, paymentTokenAddress: string) {
    const contractClient = new DealClient(signer, TEST_NETWORK);
    const marketContract = await contractClient.getMarket()
    const signerAddress = await signer.getAddress()

    const {offerFixture} = await getDefaultOfferFixture(signerAddress, paymentTokenAddress, timestamp)

    const tx = await marketContract.registerMarketOffer(
      offerFixture.minPricePerWorkerEpoch,
      offerFixture.paymentToken,
      offerFixture.effectors,
      offerFixture.peers
    )
    await tx.wait(DEFAULT_CONFIRMATIONS)

    return offerFixture
  }

  test(`Check that it matched successfully for 1:1 configuration.`, async () => {
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress()
    console.log('Init contractClient as signer:', signerAddress);
    const contractClient = new DealClient(signer, TEST_NETWORK);
    const paymentToken = await contractClient.getUSDC()
    const paymentTokenAddress = await (paymentToken).getAddress()

    const blockNumber = await provider.getBlockNumber()
    const timestamp = (await provider.getBlock(blockNumber))?.timestamp

    console.info('Register default offer...')
    const registeredOffer = await createOffer(signer, timestamp, paymentTokenAddress)

    // Deal setup.
    const minWorkersDeal = 1
    const targetWorkersDeal = 1
    const maxWorkerPerProviderDeal = 1
    const pricePerWorkerEpochDeal = registeredOffer.minPricePerWorkerEpoch

    const coreContract = await contractClient.getCore()
    const minDealDepositedEpoches = await coreContract.minDealDepositedEpoches()
    const toApproveFromDeployer = BigInt(targetWorkersDeal) * pricePerWorkerEpochDeal * minDealDepositedEpoches
    const marketContract = await contractClient.getMarket();

    console.info('Send approve of payment token for amount = ', toApproveFromDeployer.toString())
    expect(await paymentToken.balanceOf(signerAddress)).toBeGreaterThan(toApproveFromDeployer)
    const marketAddress = await marketContract.getAddress()
    expect(marketAddress).not.toBe("0x0000000000000000000000000000")
    await paymentToken.approve(marketAddress, toApproveFromDeployer);

    console.info('Create deal that match default offer...')
    const filter = marketContract.filters.DealCreated
    const lastDealsCreatedBefore = (await marketContract.queryFilter(filter))
    const deployDealTx = await marketContract.deployDeal(
      {prefixes: "0x12345678", hash: ethers.encodeBytes32String(`appCID:${timestamp}`)},
      registeredOffer.paymentToken,
      minWorkersDeal,
      targetWorkersDeal,
      maxWorkerPerProviderDeal,
      pricePerWorkerEpochDeal,
      registeredOffer.effectors,
      0,
      []
    );
    await deployDealTx.wait(DEFAULT_CONFIRMATIONS)

    const lastDealsCreatedAfter = (await marketContract.queryFilter(filter))
    expect(lastDealsCreatedAfter.length - lastDealsCreatedBefore.length).toBe(1)
    const dealId = lastDealsCreatedAfter[lastDealsCreatedAfter.length - 1].args.deal

    console.info('Wait indexer to process transactions above...')
    await new Promise((resolve) => setTimeout(resolve, DEFAULT_SUBGRAPH_TIME_INDEXING))

    console.info(`Find matched offers for dealId: ${dealId}...`)
    const dealMatcherClient = new DealMatcherClient(TEST_NETWORK)
    const matchedOffersOut = await dealMatcherClient.getMatchedOffersByDealId(dealId)
    expect(matchedOffersOut.offers.length).toBe(1)  // At least with one previously created offer it matched.

    console.info(`Match deal with offers structure proposed by indexer: ${JSON.stringify(matchedOffersOut)}...`)
    const matchDealTx = await marketContract.matchDeal(
      dealId,
      matchedOffersOut.offers,
      matchedOffersOut.computeUnitsPerOffers,
    )
    // await matchDealTx.wait(DEFAULT_CONFIRMATIONS)
    console.log(matchDealTx)
  //   TODO: check further.

  }, TESTS_TIMEOUT)
})
