// TODO: relocate or use for CI tests of ts-client APIs (it is not a test, it a dev script for market).
// It creates market example on chain. Check out MarketExample interface and initMarketFixture with actual configuration.
// Currently used to sync Network Explorer frontend dev and to create diversed market on chain, and to create load for Subgraph.
// WARN: To run this script you also should use the Core Owner (it uses some restricted admin methods).
// For local network run:
// 1. make deploy-local && make build-npms && make deploy-subgraph-local
// 2. cd to ts-client and: npm run build && npm pack
// Run e.g. with [WARN: check out current package version before the run]:
// 3. npm i -s ../ts-client/fluencelabs-deal-ts-clients-0.6.7.tgz && node --loader ts-node/esm main-market-create.ts
// For as in vitest run:
//

// TODO: uncomment when refactored to the right place.
// import {
//     DealClient,
// } from "@fluencelabs/deal-ts-clients";
import {DealClient} from "../../src";

import {ethers, LogDescription} from "ethers";
import dotenv from "dotenv"
import assert from "node:assert";
import {test} from "vitest";

dotenv.config()

// For local it will use 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 address to deploy and run all transactions.
// For others: PRIVATE_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x";
const LOCAL_SIGNER_MNEMONIC = "test test test test test test test test test test test junk"
const RPC_URL = process.env.RPC_URL || "http://localhost:8545";
const FLUENCE_ENV = process.env.FLUENCE_ENV || 'local'
const WAIT_CONFIRMATIONS = Number(process.env.WAIT_CONFIRMATIONS || 1);

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
const CAPACITY_DEFAULT_DURATION = 60 * 60 * 24 * 30  // 30 days in seconds

type asyncRuntimeDecoratorType = (func: Function) => void;

interface MarketExample {
    providerWithCapacityCommitments: ProviderModel;
    providerToBeMatched: ProviderModel;
    providerWithoutCapacityCommitments: ProviderModel;
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

interface ProviderModel {
    offerId?: string; // assigned after offer deployed.
    providerAddress: string;
    peerIds: string[];
    computeUnitsPerPeers: string[][];
    effectors: CID[];
    minPricePerEpoch: string;
    paymentTokenAddress: string;
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
    effectors: CID[];
    listAccessType: number;  // 0 - standard, 1 - whitelist, 2 - blacklist
    listAccess: string[];
}

function initMarketFixture(paymentToken: string): MarketExample {
    const effectors: CID[] = [
        { prefix: "0x12345678", hash: ethers.hexlify(ethers.randomBytes(32)), description: "IPFS"},
        { prefix: "0x12345678", hash: ethers.hexlify(ethers.randomBytes(32)), description: "cURL"},
    ];
    const minPricePerEpoch = ethers.parseEther("0.00001");
    return {
        providerWithCapacityCommitments: {
            providerAddress: "",
            peerIds: [ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32))],
            computeUnitsPerPeers: [
                [
                    ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)),ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)),ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)),ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)),ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)),ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)),ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)),ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)),
                ],
                [
                    ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)),ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)),ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)),ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)),ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)),ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)),ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)),ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)),
                ],
            ],
            effectors,
            minPricePerEpoch: minPricePerEpoch.toString(),
            paymentTokenAddress: paymentToken,
        },
        providerToBeMatched: {
            providerAddress: "",
            peerIds: [ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32))],
            computeUnitsPerPeers: [
                [ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32))],
                [ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32))],
            ],
            effectors,
            minPricePerEpoch: minPricePerEpoch.toString(),
            paymentTokenAddress: paymentToken,
        },
        providerWithoutCapacityCommitments: {
            providerAddress: "",
            peerIds: [ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32))],
            computeUnitsPerPeers: [
                [ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32))],
                [ethers.hexlify(ethers.randomBytes(32)), ethers.hexlify(ethers.randomBytes(32))],
            ],
            effectors,
            minPricePerEpoch: minPricePerEpoch.toString(),
            paymentTokenAddress: paymentToken,
        },
        dealToMatchWithWhiteListedProvider: {
            developerAddress: "",
            appCID: { prefix: ethers.hexlify(ethers.randomBytes(4)), hash: ethers.hexlify(ethers.randomBytes(32)), description: "dealAPPCID"},
            paymentTokenAddress: paymentToken,
            minWorkers: 2,
            targetWorkers: 2,
            maxWorkerPerProvider: 2,
            pricePerWorkerEpoch: ethers.parseEther("0.01").toString(),
            effectors,
            listAccessType: 1,
            listAccess: [],  // provider address will be added after.
        },
        dealWithoutWhitelist: {
            developerAddress: "",
            appCID: { prefix: ethers.hexlify(ethers.randomBytes(4)), hash: ethers.hexlify(ethers.randomBytes(32)), description: "dealAPPCID"},
            paymentTokenAddress: paymentToken,
            minWorkers: 1,
            targetWorkers: 1,
            maxWorkerPerProvider: 1,
            pricePerWorkerEpoch: ethers.parseEther("0.01").toString(),
            effectors,
            listAccessType: 0,
            listAccess: [],
        },
        dealWithWhitelist: {
            developerAddress: "",
            appCID: { prefix: ethers.hexlify(ethers.randomBytes(4)), hash: ethers.hexlify(ethers.randomBytes(32)), description: "dealAPPCID"},
            paymentTokenAddress: paymentToken,
            minWorkers: 1,
            targetWorkers: 1,
            maxWorkerPerProvider: 1,
            pricePerWorkerEpoch: ethers.parseEther("0.01").toString(),
            effectors,
            listAccessType: 0,
            listAccess: [],
        },
    }
}

const asyncRuntimeDecorator: asyncRuntimeDecoratorType = (func) => {
    func()
        .then(() => process.exit(0))
        .catch((error: unknown) => {
            console.error(error);
            process.exit(1);
        });
};

async function main() {
    console.log('RPC_URL', RPC_URL)
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    let signer = null
    if (FLUENCE_ENV == 'local') {
        console.log(`It used const mnemonic: ${LOCAL_SIGNER_MNEMONIC} for 1st signer...`)
        signer = ethers.Wallet.fromPhrase(LOCAL_SIGNER_MNEMONIC, provider);
    } else {
        console.log('It used PRIVATE_KEY for signer...')
        signer = new ethers.Wallet(PRIVATE_KEY, provider);
    }
    console.log('PRIVATE_KEY', PRIVATE_KEY)

    // const signer = ethers.Wallet.fromPhrase("test test test test test test test test test test test junk", provider);
    const signerAddress = await signer.getAddress();
    const contractsClient = new DealClient(signer, FLUENCE_ENV);
    const marketContract = await contractsClient.getMarket();
    const marketContractAddress = await marketContract.getAddress()
    const capacityContract = await contractsClient.getCapacity();
    const paymentToken = await contractsClient.getUSDC();
    const paymentTokenAddress = await paymentToken.getAddress();
    const coreContract = await contractsClient.getCore()
    const coreContractAddress = await coreContract.getAddress()

    // Print data of signer before running into a bunch of transactions.
    console.info(`Signer address: ${signerAddress}`);
    console.info(`Signer balance: ${ethers.formatEther(await provider.getBalance(signerAddress))} ETH`);
    // TODO: why our USDC has no decimals method? change on fetching decimals instead of const 6 below.
    console.info(`Signer USDC balance: ${ethers.formatUnits(await paymentToken.balanceOf(signerAddress), 6)} USDC`);

    // Prepare market fixture.
    const marketFixture = initMarketFixture(paymentTokenAddress)
    // Insert signerAddress into fixture.
    for (const providerFixture of [marketFixture.providerWithCapacityCommitments, marketFixture.providerToBeMatched, marketFixture.providerWithoutCapacityCommitments]) {
        providerFixture.providerAddress = signerAddress;
    }
    // Insert signerAddress into deal Whitelist.
    marketFixture.dealWithWhitelist.listAccess = [signerAddress];

    console.info("1. #setProviderInfo...")
    const setProviderInfoTx = await marketContract.setProviderInfo(
        "TestProvider", {prefixes: "0x12345678", hash: ethers.hexlify(ethers.randomBytes(32))},
    );
    await setProviderInfoTx.wait(WAIT_CONFIRMATIONS);

    console.info("2. #registerMarketOffer for marketFixture.providerWithCapacityCommitments, marketFixture.providerToBeMatched, marketFixture.providerWithoutCapacityCommitments...")
    for (const providerFixture of [marketFixture.providerWithCapacityCommitments, marketFixture.providerToBeMatched, marketFixture.providerWithoutCapacityCommitments]) {
        let peerContractData: Array<{peerId: string, owner: string, unitIds: string[]}> = [];
        for (let i = 0;  i < providerFixture.peerIds.length; i++) {
            const peerId = providerFixture.peerIds[i];
            peerContractData.push(
                {
                    peerId: peerId,
                    owner: providerFixture.providerAddress,
                    unitIds: providerFixture.computeUnitsPerPeers[i],
                }
            )
        }
        console.debug(`Register ${JSON.stringify(providerFixture)}...`)
        const registerMarketOfferTx = await marketContract.registerMarketOffer(
            providerFixture.minPricePerEpoch,
            providerFixture.paymentTokenAddress,
            providerFixture.effectors.map((effector) => ({prefixes: effector.prefix, hash: effector.hash})),
            peerContractData,
        );
        const registerMarketOfferTxResult = await registerMarketOfferTx.wait(WAIT_CONFIRMATIONS);
        // Save offer ID by parsing event.
        providerFixture.offerId = getEventValue(
            {
                txReceipt: registerMarketOfferTxResult!,
                contract: marketContract,
                eventName: "MarketOfferRegistered",
                value: "offerId",
            }
        ) as string
    }

    console.info('2a. #setEffectorInfo...')
    // It does not matter what provider model to choose: all of them have the same effectors currently.
    for (const effectorModel of marketFixture.providerToBeMatched.effectors) {
        const setEffectorInfoTx = await marketContract.setEffectorInfo(
            {prefixes: effectorModel.prefix, hash: effectorModel.hash},
            effectorModel.description,
            {prefixes: effectorModel.prefix, hash: effectorModel.hash},  // it is metadata, that is currently doe snot used.
        );
        await setEffectorInfoTx.wait(WAIT_CONFIRMATIONS);
    }

    console.info("3. #createCommitment for providerWithCapacityCommitments only...");
    let createdCCIds: string[] = []
    for (const peerId of marketFixture.providerWithCapacityCommitments.peerIds) {
        const createCommitmentTx = await capacityContract.createCommitment(
            peerId,
            CAPACITY_DEFAULT_DURATION,
            // Delegator will be assigned on deposit.
            ZERO_ADDRESS,
            1,
        );
        const createCommitmentTxResult = await createCommitmentTx.wait(WAIT_CONFIRMATIONS)
        createdCCIds.push(
            getEventValue(
                {
                    txReceipt: createCommitmentTxResult!,
                    contract: capacityContract,
                    eventName: "CommitmentCreated",
                    value: "commitmentId",
                }
            ) as string
        )
    }
    console.log('3a. #depositCollateral for all capacityCommitments');
    let valueToSendForCollateralAll = BigInt(0)
    for (const CCId of createdCCIds) {
        const capcityCommitment = await capacityContract.getCommitment(CCId)
        valueToSendForCollateralAll += capcityCommitment.unitCount * capcityCommitment.collateralPerUnit
    }
    const depositCollateralTx = await capacityContract.depositCollateral(
        createdCCIds,
        {value: valueToSendForCollateralAll},
    );
    await depositCollateralTx.wait(WAIT_CONFIRMATIONS);

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

    console.log('4. #createDeal for dealToMatch, dealWithoutWhitelist, dealWithWhitelist...');
    // Prepare provider for dealToMatchWithWhiteListedProvider
    marketFixture.dealToMatchWithWhiteListedProvider.listAccess = [marketFixture.providerToBeMatched.providerAddress];

    const minDealDepositedEpoches = await coreContract.minDealDepositedEpoches()
    for (const dealFixture of [marketFixture.dealToMatchWithWhiteListedProvider, marketFixture.dealWithoutWhitelist, marketFixture.dealWithWhitelist]) {
        // First of all - approve payment token.
        const toApproveFromDeployer = BigInt(dealFixture.targetWorkers) * BigInt(dealFixture.pricePerWorkerEpoch) * minDealDepositedEpoches;
        // Upd data of the Deal model with developer address.
        dealFixture.developerAddress = signerAddress;

        console.info(
        `Send approve of payment token for amount = ${toApproveFromDeployer.toString()} to market address: ${marketContractAddress}`
        );
        const approveTx = await paymentToken.approve(marketContractAddress, toApproveFromDeployer);
        await approveTx.wait(WAIT_CONFIRMATIONS)

        console.log('TODO: send transaction itself with params', JSON.stringify(dealFixture))
        const createDealTx = await marketContract.deployDeal(
            {prefixes: dealFixture.appCID.prefix, hash: dealFixture.appCID.hash},
            dealFixture.paymentTokenAddress,
            dealFixture.minWorkers,
            dealFixture.targetWorkers,
            dealFixture.maxWorkerPerProvider,
            dealFixture.pricePerWorkerEpoch,
            dealFixture.effectors.map((effector) => ({prefixes: effector.prefix, hash: effector.hash})),
            dealFixture.listAccessType,
            dealFixture.listAccess,
        );
        const createDealTxResult = await createDealTx.wait(WAIT_CONFIRMATIONS);
        dealFixture.dealId = getEventValue(
            {
                txReceipt: createDealTxResult!,
                contract: marketContract,
                eventName: "DealCreated",
                value: "deal",
            }
        ) as string
    }

    console.log('5. Match Deal: providerToBeMatched with dealToMatchWithWhiteListedProvider...');
    if (marketFixture.dealToMatchWithWhiteListedProvider.minWorkers !== 2) {
        throw new Error('[custom] Unexpected state: dealToMatchWithWhiteListedProvider.minWorkers !== 2')
    }

    console.log('DEBUG: marketFixture.dealToMatchWithWhiteListedProvider.dealId =', marketFixture.dealToMatchWithWhiteListedProvider.dealId)
    console.log('DEBUG: marketFixture.providerToBeMatched.offerId =', marketFixture.providerToBeMatched.offerId)
    console.log('DEBUG: marketFixture.providerToBeMatched.computeUnitsPerPeers =', marketFixture.providerToBeMatched.computeUnitsPerPeers)
    // TODO: stoppped here.
    // We want to match with 2 CU and accodring to protocol restriction them should be from different peers
    const matchDealTx = await marketContract.matchDeal(
        marketFixture.dealToMatchWithWhiteListedProvider.dealId!,
        [marketFixture.providerToBeMatched.offerId!],
        [
            [marketFixture.providerToBeMatched.computeUnitsPerPeers[0][0]],
            [marketFixture.providerToBeMatched.computeUnitsPerPeers[1][0]],
        ],
    );
}

// Log Parsing Module.
type GetEventValueArgs<T extends string, U extends Contract<T>> = {
  txReceipt: ethers.TransactionReceipt;
  contract: U;
  eventName: T;
  value: string;
};

type Contract<T> = {
  getEvent(name: T): {
    fragment: { topicHash: string };
  };
  interface: {
    parseLog(log: { topics: string[]; data: string }): LogDescription | null;
  };
};

function getEventValue<T extends string, U extends Contract<T>>({
  txReceipt,
  contract,
  eventName,
  value,
}: GetEventValueArgs<T, U>) {
  const { topicHash } = contract.getEvent(eventName).fragment;

  const log = txReceipt.logs.find((log) => {
    return log.topics[0] === topicHash;
  });

  assert(
    log !== undefined,
    `Event '${eventName}' with hash '${topicHash}' not found in logs of the transaction`,
  );

  const res: unknown = contract.interface
    .parseLog({
      data: log.data,
      topics: [...log.topics],
    })
    ?.args.getValue(value);

  return res;
}

// Uncomment to run as a script.
// asyncRuntimeDecorator(main);

// TODO: deprecate sol script.
test("#asyncRuntimeDecorator for create-pure-market-script", async () => {
  await main()
})
