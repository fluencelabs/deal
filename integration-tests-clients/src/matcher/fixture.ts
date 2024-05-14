import { ethers } from "ethers";
import { ICapacity, IDealFactory, IERC20, IMarket } from "../../../ts-client/src";
import { getEventValue } from "./events.js";
import { ZERO_ADDRESS } from "./constants.js";

import { expect } from "vitest";

interface MarketExample {
  providerExample: ProviderFixtureModel;
  dealExample: DealFixtureModel;
}

export interface CID {
  prefix: string;
  hash: string;
  description: string;
}

export interface ProviderFixtureModel {
  offerId?: string; // assigned after offer is deployed.
  providerAddress: string;
  peerIds: string[];
  computeUnitsPerPeers: string[][];
  effectors: CID[];
  minPricePerEpoch: string;
  paymentTokenAddress: string;
  minProtocolVersion: number;
  maxProtocolVersion: number;
}

export interface DealFixtureModel {
  dealId?: string; // assigned after deal deployed.
  developerAddress: string;
  appCID: CID;
  paymentTokenAddress: string;
  minWorkers: number;
  targetWorkers: number;
  maxWorkerPerProvider: number;
  pricePerWorkerEpoch: string;
  // SHould be calculated: uint256 minAmount = pricePerWorkerEpoch_ * targetWorkers_ * core.minDealDepositedEpochs().
  depositAmount: string | null;
  effectors: CID[];
  listAccessType: number; // 0 - standard, 1 - whitelist, 2 - blacklist
  listAccess: string[];
  protocolVersion: number;
}

export function generateEffector(): CID {
  return {
    prefix: "0x12345678",
    hash: ethers.hexlify(ethers.randomBytes(32)),
    description: "IPFS",
  };
}

// Get success example of provider with offer fully matched deal.
export function getMarketExampleFixture(
  paymentToken: string,
  effectors: CID[],
  providerAddress: string,
): MarketExample {
  const minPricePerEpochWEI = ethers.parseEther("0.00001");
  return {
    providerExample: {
      providerAddress: providerAddress,
      peerIds: [
        ethers.hexlify(ethers.randomBytes(32)),
        ethers.hexlify(ethers.randomBytes(32)),
      ],
      computeUnitsPerPeers: [
        new Array(1).fill("0").map(() => {
          return ethers.hexlify(ethers.randomBytes(32));
        }),
        new Array(1).fill("0").map(() => {
          return ethers.hexlify(ethers.randomBytes(32));
        }),
      ],
      effectors,
      minPricePerEpoch: minPricePerEpochWEI.toString(),
      paymentTokenAddress: paymentToken,
      minProtocolVersion: 1,
      maxProtocolVersion: 1,
    },
    dealExample: {
      developerAddress: "",
      appCID: {
        prefix: ethers.hexlify(ethers.randomBytes(4)),
        hash: ethers.hexlify(ethers.randomBytes(32)),
        description: "dealExample",
      },
      paymentTokenAddress: paymentToken,
      // pricePerWorkerEpoch * newTargetWorkers * core.minDealDepositedEpochs();
      depositAmount: null,
      minWorkers: 2,
      targetWorkers: 2,
      maxWorkerPerProvider: 2,
      pricePerWorkerEpoch: minPricePerEpochWEI.toString(),
      effectors,
      listAccessType: 0,
      listAccess: [], // provider address will be added after.
      protocolVersion: 1,
    },
  };
}

// It registers market offer via provided fixture and also updates fixture with offer ID
export async function registerMarketOffersFromFixtures(
  providers: Array<ProviderFixtureModel>,
  marketContractWithSigner: IMarket,
  wait_confirmations: number,
) {
  for (const providerFixture of providers) {
    let peerContractData: Array<{
      peerId: string;
      owner: string;
      unitIds: string[];
    }> = [];
    for (let i = 0; i < providerFixture.peerIds.length; i++) {
      expect(
        providerFixture.providerAddress,
        "[Fixture validation] provider uddress should be presented.",
      ).not.to.equal("");

      const peerId = providerFixture.peerIds[i];
      peerContractData.push({
        peerId: peerId,
        owner: providerFixture.providerAddress,
        unitIds: providerFixture.computeUnitsPerPeers[i],
      });
    }
    const registerMarketOfferTx =
      await marketContractWithSigner.registerMarketOffer(
        providerFixture.minPricePerEpoch,
        providerFixture.paymentTokenAddress,
        providerFixture.effectors.map((effector) => ({
          prefixes: effector.prefix,
          hash: effector.hash,
        })),
        peerContractData,
        providerFixture.minProtocolVersion,
        providerFixture.maxProtocolVersion,
      );
    const registerMarketOfferTxResult = await registerMarketOfferTx.wait(
      wait_confirmations,
    );
    // Save offer ID by parsing event.
    providerFixture.offerId = getEventValue({
      txReceipt: registerMarketOfferTxResult!,
      contract: marketContractWithSigner,
      eventName: "MarketOfferRegistered",
      value: "offerId",
    }) as string;
  }
}

// It returns after created CC ids.
export async function createCommitmentForProviderFixtures(
  providers: Array<ProviderFixtureModel>,
  capacityContract: ICapacity,
  wait_confirmations: number,
  capacity_duration: number,
): Promise<Array<string>> {
  let createdCCIds: string[] = [];
  const allPeerIds: string[] = providers.flatMap(
    (provider) => provider.peerIds,
  );
  console.log("Create commitments for all parsed peerIds: ", allPeerIds);
  for (const peerId of allPeerIds) {
    const createCommitmentTx = await capacityContract.createCommitment(
      peerId,
      capacity_duration,
      // Delegator will be assigned on deposit.
      ZERO_ADDRESS,
      1,
    );
    const createCommitmentTxResult = await createCommitmentTx.wait(
      wait_confirmations,
    );
    createdCCIds.push(
      getEventValue({
        txReceipt: createCommitmentTxResult!,
        contract: capacityContract,
        eventName: "CommitmentCreated",
        value: "commitmentId",
      }) as string,
    );
  }
  return createdCCIds;
}

export async function depositCollateral(
  capacityCommitmentIds: Array<string>,
  capacityContract: ICapacity,
  wait_confirmations: number,
) {
  let valueToSendForCollateralAll = BigInt(0);
  for (const CCId of capacityCommitmentIds) {
    const capacityCommitment = await capacityContract.getCommitment(CCId);
    valueToSendForCollateralAll +=
      capacityCommitment.unitCount * capacityCommitment.collateralPerUnit;
  }
  const depositCollateralTx = await capacityContract.depositCollateral(
    capacityCommitmentIds,
    { value: valueToSendForCollateralAll },
  );
  await depositCollateralTx.wait(wait_confirmations);
}

// It creates Deal from fixture model and update fixture with deal ID.
export async function createDealsFromFixtures(
  deals: Array<DealFixtureModel>,
  // TODO: add deployerAddress to fixture instead.
  deployerAddress: string,
  paymentToken: IERC20,
  dealFactoryContract: IDealFactory,
  minDealDepositedEpochs: bigint,
  wait_confirmations: number,
) {
  for (const dealFixture of deals) {
    // First of all - approve payment token.
    const toApproveFromDeployer =
      BigInt(dealFixture.targetWorkers) *
      BigInt(dealFixture.pricePerWorkerEpoch) *
      minDealDepositedEpochs;
    // Upd data of the Deal model with developer address.
    dealFixture.developerAddress = deployerAddress;

    const dealFactoryAddress = await dealFactoryContract.getAddress();
    console.info(
      `Send approve of payment token for amount = ${toApproveFromDeployer.toString()} to market address: ${dealFactoryAddress}`,
    );
    const approveTx = await paymentToken.approve(
      dealFactoryAddress,
      toApproveFromDeployer,
    );
    await approveTx.wait(wait_confirmations);

    const depositAmount =
      BigInt(dealFixture.pricePerWorkerEpoch) *
      BigInt(dealFixture.targetWorkers) *
      minDealDepositedEpochs;
    const createDealTx = await dealFactoryContract.deployDeal(
      { prefixes: dealFixture.appCID.prefix, hash: dealFixture.appCID.hash },
      dealFixture.paymentTokenAddress,
      depositAmount,
      dealFixture.minWorkers,
      dealFixture.targetWorkers,
      dealFixture.maxWorkerPerProvider,
      dealFixture.pricePerWorkerEpoch,
      dealFixture.effectors.map((effector) => ({
        prefixes: effector.prefix,
        hash: effector.hash,
      })),
      dealFixture.listAccessType,
      dealFixture.listAccess,
      dealFixture.protocolVersion,
    );
    const createDealTxResult = await createDealTx.wait(wait_confirmations);
    dealFixture.dealId = getEventValue({
      txReceipt: createDealTxResult!,
      contract: dealFactoryContract,
      eventName: "DealCreated",
      value: "deal",
    }) as string;
  }
}
