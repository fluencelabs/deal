// TODO: relocate or use for CI tests of ts-client APIs (it is not a test, it a dev script for market).
// To run: you need to have infra: deployed contracts on local and run: `npm run integration`

// Instruction below does not work for now, use instruction run above.
// It creates market example on chain. Check out MarketExample interface and initMarketFixture with actual configuration.
// Currently used to sync Network Explorer frontend dev and to create diversed market on chain, and to create load for Subgraph.
// WARN: To run this script you also should use the Core Owner (it uses some restricted admin methods).
// For local network run:
// 1. make deploy-local && make build-npms && make deploy-subgraph-local
// 2. cd to ts-client and: npm run build && npm pack
// Run e.g. with [WARN: check out current package version before the run]:
// 3. npm i -s ../ts-client/fluencelabs-deal-ts-clients-0.6.7.tgz && node --loader ts-node/esm main-market-create.ts

// TODO: uncomment when refactored to the right place.
// import {
//     DealClient,
// } from "@fluencelabs/deal-ts-clients";
import { DealClient } from "../../../src";

import { ethers, LogDescription } from "ethers";
import dotenv from "dotenv";
import { test } from "vitest";
import {
  createCommitmentForProviderFixtures,
  createDealsFromFixtures,
  depositCollateral,
  getMarketExampleFixture,
  registerMarketOffersFromFixtures,
  updateProviderFixtureAddress,
} from "../fixture";

dotenv.config();

// For local it will use 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 address to deploy and run all transactions.
// For others: PRIVATE_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x";
const LOCAL_SIGNER_MNEMONIC =
  "test test test test test test test test test test test junk";
const RPC_URL = process.env.RPC_URL || "http://localhost:8545";
const FLUENCE_ENV = process.env.FLUENCE_ENV || "local";
const WAIT_CONFIRMATIONS = Number(process.env.WAIT_CONFIRMATIONS || 1);

const CAPACITY_DEFAULT_DURATION = 60 * 60 * 24 * 30; // 30 days in seconds

type asyncRuntimeDecoratorType = (func: Function) => void;

const asyncRuntimeDecorator: asyncRuntimeDecoratorType = (func) => {
  func()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
      console.error(error);
      process.exit(1);
    });
};

async function main() {
  console.log("RPC_URL", RPC_URL);
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  let signer: ethers.Signer;
  if (FLUENCE_ENV == "local") {
    console.log(
      `It used const mnemonic: ${LOCAL_SIGNER_MNEMONIC} for 1st signer...`,
    );
    signer = ethers.Wallet.fromPhrase(LOCAL_SIGNER_MNEMONIC, provider);
  } else {
    console.log("It used PRIVATE_KEY for signer...");
    signer = new ethers.Wallet(PRIVATE_KEY, provider);
  }
  console.log("PRIVATE_KEY", PRIVATE_KEY);

  const signerAddress = await signer.getAddress();
  const contractsClient = new DealClient(signer, FLUENCE_ENV);
  const marketContract = await contractsClient.getMarket();
  const marketContractAddress = await marketContract.getAddress();
  const capacityContract = await contractsClient.getCapacity();
  const paymentToken = await contractsClient.getUSDC();
  const paymentTokenAddress = await paymentToken.getAddress();
  const coreContract = await contractsClient.getCore();
  const coreContractAddress = await coreContract.getAddress();
  const dealFactoryContract = await contractsClient.getDealFactory();
  const dealFactoryContractAddress = await dealFactoryContract.getAddress();

  // Print data of signer before running into a bunch of transactions.
  console.info(`Signer address: ${signerAddress}`);
  console.info(
    `Signer balance: ${ethers.formatEther(
      await provider.getBalance(signerAddress),
    )} ETH`,
  );
  // TODO: why our USDC has no decimals method? change on fetching decimals instead of const 6 below.
  console.info(
    `Signer USDC balance: ${ethers.formatUnits(
      await paymentToken.balanceOf(signerAddress),
      6,
    )} USDC`,
  );

  // Prepare market fixture.
  const marketFixture = getMarketExampleFixture(paymentTokenAddress);
  // Insert signerAddress into fixture.
  updateProviderFixtureAddress(signerAddress, [
    marketFixture.providerWithCapacityCommitments,
    marketFixture.providerToBeMatched,
    marketFixture.providerWithoutCapacityCommitments,
  ]);
  // Insert signerAddress into deal Whitelist.
  marketFixture.dealWithWhitelist.listAccess = [signerAddress];
  // Prepare provider for dealToMatchWithWhiteListedProvider
  marketFixture.dealToMatchWithWhiteListedProvider.listAccess = [
    marketFixture.providerToBeMatched.providerAddress,
  ];

  console.info("1. #setProviderInfo...");
  const setProviderInfoTx = await marketContract.setProviderInfo(
    "TestProvider",
    { prefixes: "0x12345678", hash: ethers.hexlify(ethers.randomBytes(32)) },
  );
  await setProviderInfoTx.wait(WAIT_CONFIRMATIONS);

  console.info(
    "2. #registerMarketOffer for marketFixture.providerWithCapacityCommitments, marketFixture.providerToBeMatched, marketFixture.providerWithoutCapacityCommitments...",
  );
  await registerMarketOffersFromFixtures(
    [
      marketFixture.providerWithCapacityCommitments,
      marketFixture.providerToBeMatched,
      marketFixture.providerWithoutCapacityCommitments,
    ],
    marketContract,
    WAIT_CONFIRMATIONS,
  );

  console.info("2a. #setEffectorInfo...");
  // It does not matter what provider model to choose: all of them have the same effectors currently.
  for (const effectorModel of marketFixture.providerToBeMatched.effectors) {
    const setEffectorInfoTx = await marketContract.setEffectorInfo(
      { prefixes: effectorModel.prefix, hash: effectorModel.hash },
      effectorModel.description,
      { prefixes: effectorModel.prefix, hash: effectorModel.hash }, // it is metadata, that is currently doe snot used.
    );
    await setEffectorInfoTx.wait(WAIT_CONFIRMATIONS);
  }

  console.info(
    "3. #createCommitment for providerWithCapacityCommitments only...",
  );
  const createdCCIds = await createCommitmentForProviderFixtures(
    [marketFixture.providerWithCapacityCommitments],
    capacityContract,
    WAIT_CONFIRMATIONS,
    CAPACITY_DEFAULT_DURATION,
  );

  console.log("3a. #depositCollateral for all capacityCommitments");
  await depositCollateral(createdCCIds, capacityContract, WAIT_CONFIRMATIONS);

  // console.log('3b. Submit several proofs for first of CU in CC...');
  // TODO: Ensure epoch passed for CC to become active.
  //  - no TooManyProofs
  //  - ensure minRequierdProofsPerEpoch
  // const GLOBAL_NONCE = '0x0102030405060708091011121314151601020304050607080910111213141516';
  // const localNonce = '0x726517ce1ab47e90c7685cfa0746cc56be2917c0abd63bdd7983957fd1f2c674'
  // const hashToSend = '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
  // const tx = await capacityContract.submitProof(
  //     cu_id, localNonce, hashToSend
  // );
  //   const receipt = await tx.wait(WAIT_CONFIRMATIONS);

  console.log(
    "4. #createDeal for dealToMatch, dealWithoutWhitelist, dealWithWhitelist...",
  );
  const minDealDepositedEpochs = await coreContract.minDealDepositedEpochs();
  await createDealsFromFixtures(
    [
      marketFixture.dealToMatchWithWhiteListedProvider,
      marketFixture.dealWithoutWhitelist,
      marketFixture.dealWithWhitelist,
    ],
    signerAddress,
    paymentToken,
    dealFactoryContract,
    minDealDepositedEpochs,
    WAIT_CONFIRMATIONS,
  );

  console.log(
    "5. Match Deal: providerToBeMatched with dealToMatchWithWhiteListedProvider...",
  );
  if (marketFixture.dealToMatchWithWhiteListedProvider.minWorkers !== 2) {
    throw new Error(
      "[custom] Unexpected state: dealToMatchWithWhiteListedProvider.minWorkers !== 2",
    );
  }

  // We want to match with 2 CU and according to protocol restriction them should be from different peers
  // TODO: need to resolve this: https://linear.app/fluence/issue/CHAIN-400/bug-in-matchermatchdeal-when-match-with-whitelisted-deal
  //  or rewrite match with CUs with active CC.
  console.log(
    "marketFixture.dealToMatchWithWhiteListedProvider.dealId",
    marketFixture.dealToMatchWithWhiteListedProvider.dealId,
  );
  const matchDealTx = await marketContract.matchDeal(
    marketFixture.dealToMatchWithWhiteListedProvider.dealId!,
    [
      marketFixture.providerToBeMatched.offerId!,
      marketFixture.providerToBeMatched.offerId!,
    ],
    [
      [marketFixture.providerToBeMatched.computeUnitsPerPeers[0][0]],
      [marketFixture.providerToBeMatched.computeUnitsPerPeers[1][0]],
    ],
  );
}

// Uncomment to run as a script.
// asyncRuntimeDecorator(main);

const TEST_TIMEOUT = 300000;
test(
  "#asyncRuntimeDecorator for create-pure-market-script",
  async () => {
    await main();
  },
  TEST_TIMEOUT,
);
