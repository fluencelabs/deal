import { beforeAll, describe, expect, test } from "vitest";
import { registerMarketOffer } from "./helpers.js";
import { getPeerFixture, getUnitIdFixture, randomCID } from "./fixtures.js";
import { DEFAULT_CONFIRMATIONS } from "./constants.js";
import { confirmEvents } from "./confirmations.js";
import { ethers, JsonRpcProvider, JsonRpcSigner } from "ethers";
import { type ContractsENV, DealClient } from "@fluencelabs/deal-ts-clients";
import dns from "node:dns/promises";

const ip = await dns.lookup("akim-dev.dev.fluence.dev");
const TEST_NETWORK: ContractsENV = "local";
const TEST_RPC_URL = `http://${ip.address}:8545`;
const DEFAULT_TEST_TIMEOUT = 180000;

let provider: JsonRpcProvider;
let signer: JsonRpcSigner;
let contractsClient: DealClient;

describe("Modify Offer", () => {
  beforeAll(async () => {
    provider = new ethers.JsonRpcProvider(TEST_RPC_URL);
    signer = await provider.getSigner();
    contractsClient = new DealClient(signer, TEST_NETWORK);
  });

  test(
    "Edit compute peers",
    async () => {
      const marketContract = await contractsClient.getMarket();
      const capacityContract = await contractsClient.getCapacity();
      const paymentToken = await contractsClient.getUSDC();
      const paymentTokenAddress = await paymentToken.getAddress();

      const signerAddress = await signer.getAddress();

      const registeredOffer = await registerMarketOffer(
        marketContract,
        signerAddress,
        paymentTokenAddress,
      );

      console.log("Adding new compute peer...");
      const newComputePeerFixture = getPeerFixture(signerAddress, 1);

      await (
        await marketContract.addComputePeers(registeredOffer.offerId, [
          newComputePeerFixture,
        ])
      ).wait(DEFAULT_CONFIRMATIONS);

      const peerEvents = await confirmEvents(
        marketContract,
        marketContract.filters.PeerCreated,
        1,
      );
      const [peerCreatedEvent] = peerEvents;
      expect(peerCreatedEvent?.args).toEqual([
        registeredOffer.offerId,
        newComputePeerFixture.peerId,
        signerAddress,
      ]);

      console.log(registeredOffer.offerId);

      const offerAfterAddPeer = await marketContract.getOffer(
        registeredOffer.offerId,
      );
      const peerAfterCreation = await marketContract.getComputePeer(
        newComputePeerFixture.peerId,
      );
      expect(offerAfterAddPeer.peerCount).toEqual(2n);
      expect(peerAfterCreation.offerId).toEqual(registeredOffer.offerId);

      console.log("Adding new compute units to created compute peer...");

      const unitIdFixtures = [
        getUnitIdFixture(),
        getUnitIdFixture(),
      ] satisfies [string, string];

      await (
        await marketContract.addComputeUnits(
          newComputePeerFixture.peerId,
          unitIdFixtures,
        )
      ).wait(DEFAULT_CONFIRMATIONS);

      const peerUnitEvents = await confirmEvents(
        marketContract,
        marketContract.filters.ComputeUnitCreated,
        unitIdFixtures.length,
      );

      expect(peerUnitEvents.map((u) => u.args.unitId)).toEqual(
        expect.arrayContaining(unitIdFixtures),
      );

      const newUnits = await marketContract.getComputeUnitIds(
        newComputePeerFixture.peerId,
      );

      const allUnitIds = [
        ...unitIdFixtures,
        ...newComputePeerFixture.unitIds,
      ] satisfies [string, string, ...string[]];

      expect(newUnits).toEqual(expect.arrayContaining(allUnitIds));

      console.log("Removing compute units from created compute peer...");

      const [RemovedCU, ...restCUs] = allUnitIds;
      await (
        await marketContract.removeComputeUnit(RemovedCU)
      ).wait(DEFAULT_CONFIRMATIONS);

      const removeCUEvents = await confirmEvents(
        marketContract,
        marketContract.filters.ComputeUnitRemoved,
        1,
      );

      expect(removeCUEvents.map((e) => e.args)).toEqual([
        [newComputePeerFixture.peerId, RemovedCU],
      ]);

      const activeUnits = await marketContract.getComputeUnitIds(
        newComputePeerFixture.peerId,
      );
      expect(activeUnits).toEqual(expect.arrayContaining(restCUs));

      console.log("Removing compute peer...");

      // Remove all CUs from peer to delete it
      for (const restCu of restCUs) {
        await (
          await marketContract.removeComputeUnit(restCu)
        ).wait(DEFAULT_CONFIRMATIONS);
      }

      const peer = await marketContract.getComputePeer(
        newComputePeerFixture.peerId,
      );

      expect(peer.unitCount).toEqual(0n);

      await (
        await marketContract.removeComputePeer(newComputePeerFixture.peerId)
      ).wait(DEFAULT_CONFIRMATIONS);

      const removePeerEvents = await confirmEvents(
        marketContract,
        marketContract.filters.PeerRemoved,
        1,
      );
      expect(removePeerEvents.map((e) => e.args)).toEqual([
        [registeredOffer.offerId, newComputePeerFixture.peerId],
      ]);

      const offerAfterRemove = await marketContract.getOffer(
        registeredOffer.offerId,
      );

      expect(offerAfterRemove.peerCount).toEqual(1n);
    },
    DEFAULT_TEST_TIMEOUT,
  );

  test("Edit effectors", async () => {
    const marketContract = await contractsClient.getMarket();
    const paymentToken = await contractsClient.getUSDC();
    const paymentTokenAddress = await paymentToken.getAddress();

    const signerAddress = await signer.getAddress();

    const registeredOffer = await registerMarketOffer(
      marketContract,
      signerAddress,
      paymentTokenAddress,
    );

    const newEffectors = [
      {
        id: randomCID(),
        description: "description",
        metadata: randomCID(),
      },
      {
        id: randomCID(),
        description: "description",
        metadata: randomCID(),
      },
    ] as const;

    console.log("Setting effectors info...");

    for (const { id, metadata, description } of newEffectors) {
      await (
        await marketContract.setEffectorInfo(id, description, metadata)
      ).wait(DEFAULT_CONFIRMATIONS);
    }

    const addEffectorInfoEvents = await confirmEvents(
      marketContract,
      marketContract.filters.EffectorInfoSet,
      newEffectors.length,
    );

    expect(addEffectorInfoEvents.map((e) => e.args)).toEqual(
      expect.arrayContaining([
        newEffectors.map(({ id, metadata, description }) => [
          id,
          description,
          metadata,
        ]),
      ]),
    );

    console.log("Adding effector...");

    await (
      await marketContract.addEffector(
        registeredOffer.offerId,
        newEffectors.map((e) => e.id),
      )
    ).wait(DEFAULT_CONFIRMATIONS);

    const addEffectorEvents = await confirmEvents(
      marketContract,
      marketContract.filters.EffectorAdded,
      newEffectors.length,
    );

    expect(addEffectorEvents.map((e) => e.args)).toEqual(
      expect.arrayContaining(
        newEffectors.map((e) => [registeredOffer.offerId, e.id]),
      ),
    );

    console.log("Removing effector...");

    await (
      await marketContract.removeEffector(
        registeredOffer.offerId,
        newEffectors.map((e) => e.id),
      )
    ).wait(DEFAULT_CONFIRMATIONS);

    const removeEffectorEvents = await confirmEvents(
      marketContract,
      marketContract.filters.EffectorRemoved,
      newEffectors.length,
    );
    expect(removeEffectorEvents.map((e) => e.args)).toEqual(
      expect.arrayContaining(
        newEffectors.map((e) => [registeredOffer.offerId, e.id]),
      ),
    );

    console.log("Deleting effectors info...");

    for (const { id } of newEffectors) {
      await (
        await marketContract.removeEffectorInfo(id)
      ).wait(DEFAULT_CONFIRMATIONS);
    }

    const removeEffectorInfoEvents = await confirmEvents(
      marketContract,
      marketContract.filters.EffectorInfoRemoved,
      newEffectors.length,
    );
    expect(removeEffectorInfoEvents.map((e) => e.args)).toEqual(
      expect.arrayContaining(newEffectors.map((e) => [e.id])),
    );
  });

  test("Edit token and reward", async () => {
    const marketContract = await contractsClient.getMarket();
    const paymentToken = await contractsClient.getUSDC();
    const coreContract = await contractsClient.getCore();
    const paymentTokenAddress = await paymentToken.getAddress();

    const signerAddress = await signer.getAddress();

    const registeredOffer = await registerMarketOffer(
      marketContract,
      signerAddress,
      paymentTokenAddress,
    );

    console.log("Changing payment token...");

    // TODO: deploy mock token instead
    const newTokenAddress = await coreContract.getAddress();
    await (
      await marketContract.changePaymentToken(
        registeredOffer.offerId,
        newTokenAddress,
      )
    ).wait(DEFAULT_CONFIRMATIONS);

    const tokenUpdateEvents = await confirmEvents(
      marketContract,
      marketContract.filters.PaymentTokenUpdated,
      1,
    );

    expect(tokenUpdateEvents.map((e) => e.args)).toEqual([
      [registeredOffer.offerId, newTokenAddress],
    ]);

    const updatedOffer = await marketContract.getOffer(registeredOffer.offerId);
    expect(updatedOffer.paymentToken).toEqual(newTokenAddress);

    console.log("Changing min price per worker epoch...");

    const newMinPrice = ethers.parseEther("0.1");
    await (
      await marketContract.changeMinPricePerWorkerEpoch(
        registeredOffer.offerId,
        newMinPrice,
      )
    ).wait(DEFAULT_CONFIRMATIONS);

    const minPriceUpdateEvents = await confirmEvents(
      marketContract,
      marketContract.filters.MinPricePerEpochUpdated,
      1,
    );

    expect(minPriceUpdateEvents.map((e) => e.args)).toEqual([
      [registeredOffer.offerId, newMinPrice],
    ]);

    const updatedOfferByChangingMinPrice = await marketContract.getOffer(
      registeredOffer.offerId,
    );

    expect(updatedOfferByChangingMinPrice.minPricePerWorkerEpoch).toEqual(
      newMinPrice,
    );
  });
});
