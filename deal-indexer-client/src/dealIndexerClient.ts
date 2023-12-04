import { ethers, Provider as EthersProvider } from "ethers";
import {
    DealShort,
    OfferShort,
    OfferShortOrderBy,
    OrderType,
    ProviderDetailsStatusFilter,
    ProviderShort,
    OfferDetail,
    ProviderShortOrderBy,
    Effector,
    ProviderDetail,
    ProviderBase,
    DealsShortOrderBy,
    DealDetail,
    Peer,
} from "./types";
import { ContractsENV, DealClient } from "../../src";
import {
    DealQueryDocument,
    DealQueryQuery,
    DealsQueryDocument,
    DealsQueryQuery,
    OfferQueryDocument,
    OfferQueryQuery,
    OffersQueryDocument,
    OffersQueryQuery,
    ProviderQueryDocument,
    ProviderQueryQuery,
    ProvidersQueryDocument,
    ProvidersQueryQuery,
} from "../.graphclient";
import { requestIndexer } from "./indexerClient/indexerClient";

interface OffersFilters {
    search?: string | undefined;
    effectorIds?: Array<string> | undefined;
    paymentTokens?: Array<string> | undefined;
    minPricePerWorkerEpoch?: number | undefined;
    maxPricePerWorkerEpoch?: number | undefined;
    //? eslint-disable-next-line @typescript-eslint/no-unused-vars
    minCollateralPerWorker?: number | undefined;
    //? eslint-disable-next-line @typescript-eslint/no-unused-vars
    maxCollateralPerWorker?: number | undefined;
    //? eslint-disable-next-line @typescript-eslint/no-unused-vars
    onlyApproved?: boolean;
    createdAtFrom?: number | undefined;
    createdAtTo?: number | undefined;
    providerId?: string | undefined;
}

interface ProvidersFilters {
    search?: string | undefined;
    effectorIds?: Array<string> | undefined;
}

interface ByProviderAndStatusFilter {
    providerId?: string | undefined;
    status?: ProviderDetailsStatusFilter | undefined;
}

interface DealsFilters {
    search?: string | undefined;
    effectorIds?: Array<string> | undefined;
    paymentToken?: string | undefined;
    minPricePerWorkerEpoch?: number | undefined;
    maxPricePerWorkerEpoch?: number | undefined;
    createdAtFrom?: number | undefined;
    createdAtTo?: number | undefined;
    onlyApproved?: boolean;
    providerId?: string | undefined;
}

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
        } else {
            throw Error("One of chainRPCUrl or ethersProvider should be delclared.");
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
        providersFilters: ProvidersFilters,
        offset: number = 0,
        limit: number = this.DEFAULT_PAGE_LIMIT,
        orderBy: ProviderShortOrderBy = "createdAt",
        orderType: OrderType = this.DEFAULT_ORDER_TYPE,
    ): Promise<Array<ProviderShort>> {
        if (providersFilters.search) {
            console.warn("Currently search field does not implemented.");
        }
        const options = {
            ...providersFilters,
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

    async getOffersByProvider(
        byProviderAndStatusFilter: ByProviderAndStatusFilter,
        offset: number = 0,
        limit: number = this.DEFAULT_PAGE_LIMIT,
        orderBy: OfferShortOrderBy = "createdAt",
        orderType: OrderType = this.DEFAULT_ORDER_TYPE,
    ): Promise<Array<OfferShort>> {
        if (byProviderAndStatusFilter.status) {
            // TODO.
            console.warn("Status filter is not implemented.");
        }
        return await this._getOffersImpl({ providerId: byProviderAndStatusFilter.providerId }, offset, limit, orderBy, orderType);
    }

    async getDealsByProvider(
        byProviderAndStatusFilter: ByProviderAndStatusFilter,
        offset: number = 0,
        limit: number = this.DEFAULT_PAGE_LIMIT,
        orderBy: DealsShortOrderBy = "createdAt",
        orderType: OrderType = this.DEFAULT_ORDER_TYPE,
    ): Promise<Array<DealShort>> {
        if (byProviderAndStatusFilter.status) {
            // TODO.
            console.warn("Status filter is not implemented.");
        }
        return await this._getDealsImpl({ providerId: byProviderAndStatusFilter.providerId }, offset, limit, orderBy, orderType);
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

    async _getOffersImpl(
        offerFilters: OffersFilters,
        // TODO: simplify general args declaration.
        offset: number = 0,
        limit: number = this.DEFAULT_PAGE_LIMIT,
        orderBy: OfferShortOrderBy = "createdAt",
        orderType: OrderType = this.DEFAULT_ORDER_TYPE,
    ): Promise<Array<OfferShort>> {
        if (offerFilters.search) {
            console.warn("Currently search field does not implemented.");
        }
        const options = {
            ...offerFilters,
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
        offerFilters: OffersFilters,
        // TODO: simplify general args declaration.
        offset: number = 0,
        limit: number = this.DEFAULT_PAGE_LIMIT,
        orderBy: OfferShortOrderBy = "createdAt",
        orderType: OrderType = this.DEFAULT_ORDER_TYPE,
    ): Promise<Array<OfferShort>> {
        return await this._getOffersImpl(offerFilters, offset, limit, orderBy, orderType);
    }

    _composePeers(peers: unknown): Array<Peer> {
        const peersComposed = [];
        if (peers) {
            for (const peer of peers) {
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
        }
        return peersComposed;
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
            res["peers"] = this._composePeers(data.offer.peers);
        }
        return res;
    }

    async _getDealsImpl(
        dealsFilters: DealsFilters,
        // TODO: simplify general args declaration.
        offset: number = 0,
        limit: number = this.DEFAULT_PAGE_LIMIT,
        orderBy: DealsShortOrderBy = "createdAt",
        orderType: OrderType = this.DEFAULT_ORDER_TYPE,
    ): Promise<Array<DealShort>> {
        if (dealsFilters.search) {
            console.warn("Currently search field does not implemented.");
        }
        const options = {
            ...dealsFilters,
            offset,
            limit,
            orderBy,
            orderType,
        };
        const data = (await requestIndexer(DealsQueryDocument, options)) as DealsQueryQuery;
        const res = [];
        if (data) {
            for (const deal of data.deals) {
                res.push(this._composeDealsShort(deal));
            }
        }
        return res;
    }

    _composeDealsShort(deal: unknown): DealShort {
        const effectors = this._composeEffectors(deal.effectors);
        return {
            id: deal.id,
            createdAt: deal.createdAt,
            client: deal.client,
            minWorkers: deal.minWorkers,
            targetWorkers: deal.targetWorkers,
            paymentToken: { address: deal.paymentToken.id, symbol: deal.paymentToken.symbol },
            effectors: effectors,
            // TODO:
            // balance
            // status
            // registeredWorkers
            // matchedWorkers
            // totalEarnings
        } as DealShort;
    }

    /*
     * @dev Deprecated:
     * - minCollateralPerWorker
     * - maxCollateralPerWorker
     */
    async getDeals(
        dealFilters: DealsFilters,
        // TODO: simplify general args declaration.
        offset: number = 0,
        limit: number = this.DEFAULT_PAGE_LIMIT,
        orderBy: DealsShortOrderBy = "createdAt",
        orderType: OrderType = this.DEFAULT_ORDER_TYPE,
    ): Promise<Array<DealShort>> {
        return await this._getDealsImpl(dealFilters, offset, limit, orderBy, orderType);
    }

    async getDeal(dealId: string): Promise<DealDetail> {
        const options = {
            id: dealId,
        };
        const data = (await requestIndexer(DealQueryDocument, options)) as DealQueryQuery;
        let res = null;
        if (data && data.deal) {
            const deal = data.deal;
            res = this._composeDealsShort(deal);
            res["pricePerWorkerEpoch"] = deal.pricePerWorkerEpoch;
            res["computeUnits"] = deal.addedComputeUnits;
            res["whitelist"] = [];
            res["blacklist"] = [];
        }
        return res;
    }
}

/*
 * @deprecated: rename to DealExplorerClient
 */
export class DealIndexerClient extends DealExplorerClient {}
