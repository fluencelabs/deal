import {Core, Deal, IERC20} from "../src";
import {ethers} from "ethers";


export interface Env {
    core: Core;
    flt: IERC20;
}


export const testDataFixture: {
        deal: Deal | undefined;
        pricePerWorkerEpoch: bigint;
        effectors: Array<{
            prefixes: string;
            hash: string;
        }>;
        providers: Array<{
            signer: ethers.Signer;
            peers: Array<{
                peerId: string;
                freeUnits: number;
                units: Array<string>;
            }>;
            offerId: string;
        }>;
        dealSettings: {
            deposited: bigint;
            appCID: {
                prefixes: string;
                hash: string;
            };
            minWorkers: bigint;
            targetWorkers: bigint;
            maxWorkerPerProvider: bigint;
            accessType: number;
        };
    } = {
        deal: undefined,
        pricePerWorkerEpoch: ethers.parseEther("0.01"),
        effectors: Array.from({ length: 10 }, () => ({
            prefixes: ethers.hexlify(ethers.randomBytes(4)),
            hash: ethers.hexlify(ethers.randomBytes(32)),
        })),
        providers: [],
        dealSettings: {
            deposited: 0n,
            appCID: {
                prefixes: ethers.hexlify(ethers.randomBytes(4)),
                hash: ethers.hexlify(ethers.randomBytes(32)),
            },
            minWorkers: 60n,
            targetWorkers: 60n,
            maxWorkerPerProvider: 3n,
            accessType: 0, // 0 - standart, 1 - whitelist, 2 - blacklist
        },
    };


export function generateProviders(signers) {
    let providers = []
    signers.map((signer) => {
        providers.push({
            signer: signer,
            peers: new Array(3).fill(0).map(() => {
                return {
                    peerId: ethers.hexlify(ethers.randomBytes(32)),
                    freeUnits: 1,
                    units: [],
                };
            }),
            offerId: ethers.hexlify(ethers.randomBytes(32)),
        })
    });

    return providers
}


export async function registerFixtureProvider(testDataFixture, provider, env: Env) {
    const computeProviderSigner = provider.signer;
    const fltAddress = await env.flt.getAddress()
    const registerOfferTx = await env.core.connect(computeProviderSigner).registerMarketOffer(
        provider.offerId,
        testDataFixture.pricePerWorkerEpoch,
        fltAddress,
        testDataFixture.effectors,
        provider.peers.map((x) => ({
            peerId: x.peerId,
            freeUnits: x.freeUnits,
        })),
    );
    return await registerOfferTx.wait()
}
