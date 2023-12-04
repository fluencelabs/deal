import { ethers, Provider as EthersProvider } from "ethers";
import {
    Deal,
    DealShort,
    DealStatus,
    OfferShort,
    OfferShortOrderBy,
    OrderType,
    Provider,
    ProviderDetailsStatusFilter,
    ProviderShort,
    ShortDeal,
    OfferDetail,
    ProviderShortOrderBy,
    Effector, ProviderDetail, ProviderBase,
} from "./types";
import { ContractsENV, DealClient } from "../../src";
import {
    OfferQueryDocument,
    OfferQueryQuery,
    OffersQueryDocument,
    OffersQueryQuery, ProviderQueryDocument, ProviderQueryQuery,
    ProvidersQueryDocument,
    ProvidersQueryQuery,
} from "../.graphclient";
import { requestIndexer } from "./indexerClient/indexerClient";

/*
 * @dev Currently this client depends on contract artifacts and on subgraph artifacts.
 * @dev It supports mainnet, testnet by selecting related contractsEnv.
 * TODO: Note, deprecated: do not use chainRPCUrl, use ethersProvider instead.
 */
export class DealExplorerClient {
    private indexerUrl: string;
    DEFAULT_CONTRACTS_ENV: ContractsENV = "kras";
    DEFAULT_PAGE_LIMIT = 100;
    DEFAULT_ORDER_TYPE: OrderType = "desc";

    private ethersProvider: EthersProvider;
    private contractDealClient: DealClient;
    constructor(indexerUrl: string, chainRpcUrl?: string, ethersProvider?: EthersProvider, contractsEnv?: ContractsENV) {
        if (chainRpcUrl) {
            console.warn("Do not use chainRPCUrl, use ethersProvider instead.");
            this.ethersProvider = new ethers.JsonRpcProvider(chainRpcUrl);
        } else if (ethersProvider) {
            this.ethersProvider = ethersProvider;
        }
        this.indexerUrl = indexerUrl;
        this.contractDealClient = new DealClient(contractsEnv || this.DEFAULT_CONTRACTS_ENV, this.ethersProvider);
    }

    _composeProviderBase(provider: unknown): ProviderBase {
        return {
            id: provider.id,
            createdAt: provider.createdAt,
            totalComputeUnits: provider.computeUnitsTotal,
            freeComputeUnits: provider.computeUnitsAvailable,
            name: provider.name,
            // TODO: add logic for approved.
            isApproved: true,
        } as ProviderBase;
    }

    _composeProviderShort(provider: unknown): ProviderShort {
        const providerBase = this._composeProviderBase(provider);
        const composedOffers = [];
        if (provider.offers) {
            for (const offer in provider.offers) {
                composedOffers.push(this._composeOfferShort(offer));
            }
        }
        return {
            ...providerBase,
            offers: composedOffers,
        } as ProviderShort;
    }

    /*
     * @dev: search: you could perform search by `provider address` or `provider name`.
     * @dev Note, deprecation:
     * @dev - skip: renamed to offset
     * @dev - take: renamed to limit
     * @dev - order: renamed to orderBy
     * @dev - search: provide just a search txt.
     * @dev - searchValue: deprecated.
     */
    async getProviders(
        search: string | undefined = undefined,
        effectorIds: Array<string> | undefined = undefined,
        offset: number = 0,
        limit: number = this.DEFAULT_PAGE_LIMIT,
        orderBy: ProviderShortOrderBy = "createdAt",
        orderType: OrderType = this.DEFAULT_ORDER_TYPE,
    ): Promise<Array<ProviderShort>> {
        if (search) {
            console.warn("Currently search field does not implemented.");
        }
        const options = {
            effectorIds,
            offset,
            limit,
            orderBy,
            orderType,
        };
        const data = (await requestIndexer(ProvidersQueryDocument, options)) as ProvidersQueryQuery;
        const res = [];
        if (data) {
            for (const provider of data.providers) {
                res.push(this._composeProviderShort(provider));
            }
        }
        return res;
    }

    async getProvider(providerId: string): Promise<ProviderDetail> {
        const options = {
            id: providerId,
        };
        const data = (await requestIndexer(ProviderQueryDocument, options)) as ProviderQueryQuery;
        let res = null;
        if (data && data.provider) {
            const providerFetched = data.provider;
            const providerBase = this._composeProviderBase(providerFetched);
            res = {
                ...providerBase,
                peerCount: providerFetched.peerCount,
                effectorCount: providerFetched.effectorCount,
            };
        }
        return res;
    }

    async getOffersByProvider(providerId: string, filter: ProviderDetailsStatusFilter): Promise<Array<OfferShort>> {
        return new Array(5).map((x, i) => ({
            id: ethers.hexlify(ethers.randomBytes(32)),
            name: `Test offer ${i}`,
            createdAt: new Date().getTime() / 1000 - i * 24 * 60 * 60,
            updatedAt: new Date().getTime() / 1000 - i * 24 * 60 * 60,
            maxCollateralPerWorker: 10 * i,
            minPricePerWorkerEpoch: 1.2 * i,
            paymentToken: {
                address: ethers.hexlify(ethers.randomBytes(20)),
                symbol: "USDT",
            },
            totalComputeUnits: 12 * i,
            freeComputeUnits: 1 * i,
            effectors: [
                {
                    cid: "rendomCID",
                    description: "Test effector #1",
                },
                {
                    cid: "rendomCID",
                    description: "Test effector #2",
                },
            ],
        }));
    }

    async getDealsByProvider(providerId: string, filter: ProviderDetailsStatusFilter): Promise<Array<ShortDeal>> {
        return new Array(5).map((x, i) => ({
            id: ethers.hexlify(ethers.randomBytes(20)),
            offerId: ethers.hexlify(ethers.randomBytes(32)),
            client: ethers.hexlify(ethers.randomBytes(20)),
            paymentToken: {
                address: ethers.hexlify(ethers.randomBytes(20)),
                symbol: "USDT",
            },
            createdAt: new Date().getTime() / 1000 - i * 24 * 60 * 60,
            minWorkers: 1 * i,
            targetWorkers: 3 * i,
            registeredWorkers: 2 * i,
            status: DealStatus.Active,
        }));
    }

    _composeEffectors(effectors: unknown): Array<Effector> {
        const effectorsComposed = [];
        if (effectors) {
            effectors.map((effector) => {
                effectorsComposed.push({
                    cid: effector.effector.id,
                    description: effector.effector.description,
                });
            });
        }
        return effectorsComposed;
    }

    _composeOfferShort(offer: unknown): OfferShort {
        const effectors = this._composeEffectors(offer.effectors);
        return {
            id: offer.id,
            createdAt: offer.createdAt,
            totalComputeUnits: offer.computeUnitsTotal,
            freeComputeUnits: offer.computeUnitsAvailable,
            paymentToken: { address: offer.paymentToken.id, symbol: offer.paymentToken.symbol },
            effectors: effectors,
        } as OfferShort;
    }

    /*
     * @dev Get offers list for 1 page and specified filters.
     * @dev # Deprecated Notice:
     * @dev - minCollateralPerWorker
     * @dev - maxCollateralPerWorker
     * @dev - skip: renamed to offset
     * @dev - take: renamed to limit
     * @dev - order: renamed to orderBy
     * @dev - paymentToken: array of paymentTokens
     * TODO: remove unused vars.
     * TODO: use onlyApproved.
     */
    async getOffers(
        search: string | undefined = undefined,
        effectorIds: Array<string> | undefined = undefined,
        paymentTokens: Array<string> | undefined = undefined,
        minPricePerWorkerEpoch: number | undefined = undefined,
        maxPricePerWorkerEpoch: number | undefined = undefined,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        minCollateralPerWorker: number | undefined = undefined,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        maxCollateralPerWorker: number | undefined = undefined,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onlyApproved: boolean = false,
        createdAtFrom: number | undefined = undefined,
        createdAtTo: number | undefined = undefined,
        // TODO: simplify general args declaration.
        offset: number = 0,
        limit: number = this.DEFAULT_PAGE_LIMIT,
        orderBy: OfferShortOrderBy = "createdAt",
        orderType: OrderType = this.DEFAULT_ORDER_TYPE,
    ): Promise<Array<OfferShort>> {
        if (search) {
            console.warn("Currently search field does not implemented.");
        }
        const options = {
            createdAtFrom,
            createdAtTo,
            minPricePerWorkerEpoch,
            maxPricePerWorkerEpoch,
            paymentTokens,
            effectorIds,
            offset,
            limit,
            orderBy,
            orderType,
        };
        const data = (await requestIndexer(OffersQueryDocument, options)) as OffersQueryQuery;
        const res = [];
        if (data) {
            for (const offer of data.offers) {
                res.push(this._composeOfferShort(offer));
            }
        }
        return res;
    }

    // Return OfferDetail View.
    async getOffer(offerId: string): Promise<OfferDetail | null> {
        const options = {
            id: offerId,
        };
        const data = (await requestIndexer(OfferQueryDocument, options)) as OfferQueryQuery;
        let res = null;
        if (data && data.offer) {
            res = this._composeOfferShort(data.offer);
            res["updatedAt"] = data.offer.updatedAt;
            const peersComposed = [];
            if (data.offer.peers) {
                for (const peer of data.offer.peers) {
                    const computeUnitsComposed = [];
                    for (const cu of peer.computeUnits) {
                        computeUnitsComposed.push({ id: cu.id, workerId: cu.workerId });
                    }
                    peersComposed.push({
                        id: peer.id,
                        offerId: peer.offer.id,
                        computeUnits: computeUnitsComposed,
                    });
                }
                res["peers"] = peersComposed;
            }
        }
        return res;
    }

    async getDeals(
        effectorIds: Array<string> | undefined = undefined,
        paymentToken: string | undefined = undefined,
        minPricePerWorkerEpoch: number | undefined = undefined,
        maxPricePerWorkerEpoch: number | undefined = undefined,
        minCollateralPerWorker: number | undefined = undefined,
        maxCollateralPerWorker: number | undefined = undefined,
        createdAtFrom: number | undefined = undefined,
        createdAtTo: number | undefined = undefined,
        onlyApproved: boolean = false,
        skip: number,
        take: number,
        order: OfferShortOrder,
    ): Promise<Array<DealShort>> {
        return new Array(5).map((x, i) => ({
            id: ethers.hexlify(ethers.randomBytes(20)),
            createdAt: new Date().getTime() / 1000 - i * 24 * 60 * 60,
            owner: ethers.hexlify(ethers.randomBytes(20)),
            minWorkers: 1 * i,
            targetWorkers: 3 * i,
            matchedWorkers: 2 * i,
            registeredWorkers: 2 * i,
            balance: 100 * i,
            status: DealStatus.Active,
        }));
    }

    async getDeal(dealId: string): Promise<Deal> {
        return {
            id: ethers.hexlify(ethers.randomBytes(20)),
            appCID: "randomCID",
            owner: ethers.hexlify(ethers.randomBytes(20)),
            createdAt: new Date().getTime() / 1000,
            minWorkers: 1,
            targetWorkers: 3,
            matchedWorkers: 2,
            registeredWorkers: 2,
            paymentToken: {
                address: ethers.hexlify(ethers.randomBytes(20)),
                symbol: "USDT",
            },
            pricePerWorkerEpoch: 1.2,
            collateral: 10,
            computeUnits: new Array(5).map((x, i) => ({
                id: ethers.hexlify(ethers.randomBytes(32)),
                collateral: 10,
                workerId: ethers.hexlify(ethers.randomBytes(32)),
            })),
            whitelist: new Array(5).map((x, i) => ethers.hexlify(ethers.randomBytes(20))),
            blacklist: new Array(5).map((x, i) => ethers.hexlify(ethers.randomBytes(20))),
            effectors: new Array(5).map((x, i) => ({
                cid: "rendomCID",
                description: `Test effector #{i}`,
            })),
            totalPaidAmount: 100,
            status: DealStatus.Active,
        };
    }
}

/*
 * @deprecated: rename to DealExplorerClient
 */
export class DealIndexerClient extends DealExplorerClient {}
