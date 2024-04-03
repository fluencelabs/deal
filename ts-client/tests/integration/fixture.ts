import { ethers } from "ethers";
import { ICapacity, IDealFactory, IERC20, IMarket } from "../../src";
import { getEventValue } from "./events";
import { ZERO_ADDRESS } from "./constants";

import { expect } from "vitest";

interface MarketExample {
  providerWithCapacityCommitments: ProviderFixtureModel;
  providerToBeMatched: ProviderFixtureModel;
  providerWithoutCapacityCommitments: ProviderFixtureModel;
  dealToMatchWithWhiteListedProvider: DealModel;
  dealWithoutWhitelist: DealModel;
  dealWithWhitelist: DealModel;
  //     TODO: with CC but without deposit
  //     TODO: with CC that expired soon.
  //     TODO: deal to match with CC active.
}

interface CID {
  prefix: string;
  hash: string;
  description: string;
}

interface ProviderFixtureModel {
  offerId?: string; // assigned after offer deployed.
  providerAddress: string;
  peerIds: string[];
  computeUnitsPerPeers: string[][];
  effectors: CID[];
  minPricePerEpoch: string;
  paymentTokenAddress: string;
  minProtocolVersion: number;
  maxProtocolVersion: number;
}

interface DealModel {
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

export function getMarketExampleFixture(paymentToken: string): MarketExample {
  const effectors: CID[] = [
    {
      prefix: "0x12345678",
      hash: ethers.hexlify(ethers.randomBytes(32)),
      description: "IPFS",
    },
    {
      prefix: "0x12345678",
      hash: ethers.hexlify(ethers.randomBytes(32)),
      description: "cURL",
    },
  ];
  const minPricePerEpoch = ethers.parseEther("0.00001");
  return {
    providerWithCapacityCommitments: {
      providerAddress: "",
      peerIds: [
        ethers.hexlify(ethers.randomBytes(32)),
        ethers.hexlify(ethers.randomBytes(32)),
      ],
      computeUnitsPerPeers: [
        new Array(20).fill("0").map(() => {
          return ethers.hexlify(ethers.randomBytes(32));
        }),
        new Array(20).fill("0").map(() => {
          return ethers.hexlify(ethers.randomBytes(32));
        }),
      ],
      effectors,
      minPricePerEpoch: minPricePerEpoch.toString(),
      paymentTokenAddress: paymentToken,
      minProtocolVersion: 1,
      maxProtocolVersion: 1,
    },
    providerToBeMatched: {
      providerAddress: "",
      peerIds: [
        ethers.hexlify(ethers.randomBytes(32)),
        ethers.hexlify(ethers.randomBytes(32)),
      ],
      computeUnitsPerPeers: [
        new Array(4).fill("0").map(() => {
          return ethers.hexlify(ethers.randomBytes(32));
        }),
        new Array(4).fill("0").map(() => {
          return ethers.hexlify(ethers.randomBytes(32));
        }),
      ],
      effectors,
      minPricePerEpoch: minPricePerEpoch.toString(),
      paymentTokenAddress: paymentToken,
      minProtocolVersion: 1,
      maxProtocolVersion: 1,
    },
    providerWithoutCapacityCommitments: {
      providerAddress: "",
      peerIds: [
        ethers.hexlify(ethers.randomBytes(32)),
        ethers.hexlify(ethers.randomBytes(32)),
      ],
      computeUnitsPerPeers: [
        new Array(2).fill("0").map(() => {
          return ethers.hexlify(ethers.randomBytes(32));
        }),
        new Array(2).fill("0").map(() => {
          return ethers.hexlify(ethers.randomBytes(32));
        }),
      ],
      effectors,
      minPricePerEpoch: minPricePerEpoch.toString(),
      paymentTokenAddress: paymentToken,
      minProtocolVersion: 1,
      maxProtocolVersion: 1,
    },
    dealToMatchWithWhiteListedProvider: {
      developerAddress: "",
      appCID: {
        prefix: ethers.hexlify(ethers.randomBytes(4)),
        hash: ethers.hexlify(ethers.randomBytes(32)),
        description: "dealAPPCID",
      },
      paymentTokenAddress: paymentToken,
      // pricePerWorkerEpoch * newTargetWorkers * core.minDealDepositedEpochs();
      depositAmount: null,
      minWorkers: 2,
      targetWorkers: 2,
      maxWorkerPerProvider: 2,
      pricePerWorkerEpoch: ethers.parseEther("0.01").toString(),
      effectors,
      listAccessType: 1,
      listAccess: [], // provider address will be added after.
      protocolVersion: 1,
    },
    dealWithoutWhitelist: {
      developerAddress: "",
      appCID: {
        prefix: ethers.hexlify(ethers.randomBytes(4)),
        hash: ethers.hexlify(ethers.randomBytes(32)),
        description: "dealAPPCID",
      },
      paymentTokenAddress: paymentToken,
      depositAmount: null,
      minWorkers: 1,
      targetWorkers: 1,
      maxWorkerPerProvider: 1,
      pricePerWorkerEpoch: ethers.parseEther("0.01").toString(),
      effectors,
      listAccessType: 0,
      listAccess: [],
      protocolVersion: 1,
    },
    dealWithWhitelist: {
      developerAddress: "",
      appCID: {
        prefix: ethers.hexlify(ethers.randomBytes(4)),
        hash: ethers.hexlify(ethers.randomBytes(32)),
        description: "dealAPPCID",
      },
      paymentTokenAddress: paymentToken,
      depositAmount: null,
      minWorkers: 1,
      targetWorkers: 1,
      maxWorkerPerProvider: 1,
      pricePerWorkerEpoch: ethers.parseEther("0.01").toString(),
      effectors,
      listAccessType: 0,
      listAccess: [],
      protocolVersion: 1,
    },
  };
}

// It updates provider address into provider fixture dictionaries.
export function updateProviderFixtureAddress(
  address: string,
  providers: Array<ProviderFixtureModel>,
) {
  for (const providerFixture of providers) {
    providerFixture.providerAddress = address;
  }
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
        "[Fixture validation] provider address should be presented.",
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
    const registerMarketOfferTxResult =
      await registerMarketOfferTx.wait(wait_confirmations);
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
    const createCommitmentTxResult =
      await createCommitmentTx.wait(wait_confirmations);
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
    const capcityCommitment = await capacityContract.getCommitment(CCId);
    valueToSendForCollateralAll +=
      capcityCommitment.unitCount * capcityCommitment.collateralPerUnit;
  }
  const depositCollateralTx = await capacityContract.depositCollateral(
    capacityCommitmentIds,
    { value: valueToSendForCollateralAll },
  );
  await depositCollateralTx.wait(wait_confirmations);
}

// It creates Deal from fixture model and update fixture with deal ID.
export async function createDealsFromFixtures(
  deals: Array<DealModel>,
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
