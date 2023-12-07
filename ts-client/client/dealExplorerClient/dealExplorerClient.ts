// @ts-nocheck
import { ethers } from "ethers";
import {
    DealShort,
    OfferShort,
    OfferShortOrderBy,
    OrderType,
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
import { ByProviderAndStatusFilter, DealsFilters, OffersFilters, ProvidersFilters } from "./filters";
import { IndexerClient } from "./indexerClient/indexerClient";
import { BasicOfferFragment, ProviderOfProvidersQueryFragment } from "./indexerClient/queries/providers-query.generated";
import { Deal_Filter, Deal_OrderBy, Offer_Filter, Offer_OrderBy } from "./indexerClient/generated.types";
import { BasicDealFragment } from "./indexerClient/queries/deals-query.generated";
import {DealClient, Network} from "../../ts-client";

/*
 * @dev Currently this client depends on contract artifacts and on subgraph artifacts.
 * @dev It supports mainnet, testnet by selecting related contractsEnv.
 * TODO: Note, deprecated: do not use chainRPCUrl, use ethersProvider instead.
 */
export class DealExplorerClient {
    DEFAULT_NETWORK: Network = "kras";
    DEFAULT_PAGE_LIMIT = 100;
    DEFAULT_ORDER_TYPE: OrderType = "desc";

    private ethersProvider: ethers.Provider;
    // private contractDealClient: DealClient;
    private indexerClient: IndexerClient;
    private contractsClient: DealClient;
    constructor(indexerUrl: string, chainRpcUrl?: string, ethersProvider?: ethers.Provider, network?: Network) {
        if (chainRpcUrl) {
            console.warn("Do not use chainRPCUrl, use ethersProvider instead.");
            this.ethersProvider = new ethers.JsonRpcProvider(
                chainRpcUrl,
                undefined,
                {},
            );
        } else if (ethersProvider) {
            this.ethersProvider = ethersProvider;
        } else {
            throw Error("One of chainRPCUrl or ethersProvider should be delclared.");
        }
        this.indexerClient = new IndexerClient(indexerUrl);
        // TODO: arghhhhh!
        // @ts-ignore
        this.contractsClient = new DealClient(this.ethersProvider,network || this.DEFAULT_NETWORK);
    }

    _composeProviderBase(provider: ProviderOfProvidersQueryFragment): ProviderBase {
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

    _composeProviderShort(provider: ProviderOfProvidersQueryFragment): ProviderShort {
        const providerBase = this._composeProviderBase(provider);
        const composedOffers = [];
        if (provider.offers) {
            for (const offer of provider.offers) {
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
        providersFilters?: ProvidersFilters,
        offset: number = 0,
        limit: number = this.DEFAULT_PAGE_LIMIT,
        orderBy: ProviderShortOrderBy = "createdAt",
        orderType: OrderType = this.DEFAULT_ORDER_TYPE,
    ): Promise<Array<ProviderShort>> {
        const composedFilters = {};
        if (providersFilters) {
            if (providersFilters.search) {
                console.warn("Currently search field does not implemented.");
            }
            // https://github.com/graphprotocol/graph-node/issues/2539
            // https://github.com/graphprotocol/graph-node/issues/4775
            // https://github.com/graphprotocol/graph-node/blob/ad31fd9699b0957abda459340dff093b2a279074/NEWS.md?plain=1#L30
            // Thus, kinda join should be presented on client side =(.
            if (providersFilters.effectorIds) {
                // composedFilters = { offers_: { effectors_: { effector_in: providersFilters.effectorIds } } };
                console.warn("Currently effectorIds filter does not implemented.");
            }
        }

        const data = await this.indexerClient.getProviders({
            filters: composedFilters,
            offset,
            limit,
            orderBy,
            orderType,
        });
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
        const data = await this.indexerClient.getProvider(options);
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

    _composeOfferShort(offer: BasicOfferFragment): OfferShort {
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

    _convertOfferShortOrderByToIndexerType(v: OfferShortOrderBy): Offer_OrderBy {
        if (v == "pricePerWorkerEpoch") {
            return "pricePerEpoch" as Offer_OrderBy;
        }
        return v as Offer_OrderBy;
    }

    _convertOffersFiltersToIndexerType(v?: OffersFilters): Offer_Filter {
        if (!v) {
            return {};
        }
        if (v.search) {
            console.warn("Currently search field does not implemented.");
        }
        if (v.onlyApproved) {
            console.warn("Currently onlyApproved field does not implemented.");
        }
        const res: Offer_Filter = {};
        if (v.effectorIds) {
            res.effectors_ = {
                effector_in: v.effectorIds,
            };
        }
        if (v.createdAtFrom) {
            res.createdAt_gt = v.createdAtFrom.toString();
        }
        if (v.createdAtTo) {
            res.createdAt_lt = v.createdAtTo.toString();
        }
        if (v.minPricePerWorkerEpoch) {
            res.pricePerEpoch_gt = v.minPricePerWorkerEpoch.toString();
        }
        if (v.maxPricePerWorkerEpoch) {
            res.pricePerEpoch_lt = v.maxPricePerWorkerEpoch.toString();
        }
        if (v.paymentTokens) {
            res.paymentToken_in = v.paymentTokens;
        }
        if (v.providerId) {
            res.provider = v.providerId;
        }
        return res as Offer_Filter;
    }

    async _getOffersImpl(
        offerFilters?: OffersFilters,
        offset: number = 0,
        limit: number = this.DEFAULT_PAGE_LIMIT,
        orderBy: OfferShortOrderBy = "createdAt",
        orderType: OrderType = this.DEFAULT_ORDER_TYPE,
    ): Promise<Array<OfferShort>> {
        const orderByConverted = this._convertOfferShortOrderByToIndexerType(orderBy);
        const filters = this._convertOffersFiltersToIndexerType(offerFilters);
        const data = await this.indexerClient.getOffers({
            filters,
            offset,
            limit,
            orderBy: orderByConverted,
            orderType,
        });
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
        offerFilters?: OffersFilters,
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
        const data = await this.indexerClient.getOffer(options);
        let res = null;
        if (data && data.offer) {
            res = this._composeOfferShort(data.offer);
            res["updatedAt"] = data.offer.updatedAt;
            res["peers"] = this._composePeers(data.offer.peers);
        }
        return res;
    }

    _convertDealShortOrderByToIndexerType(v: DealsShortOrderBy): Deal_OrderBy {
        // Currently no needs in convert because only createdAt.
        return v as Deal_OrderBy;
    }

    _convertDealsFiltersToIndexerType(v?: DealsFilters): Deal_Filter {
        if (!v) {
            return {};
        }
        if (v.search) {
            console.warn("Currently search field does not implemented.");
        }
        if (v.onlyApproved) {
            console.warn("Currently onlyApproved field does not implemented.");
        }
        const res: Deal_Filter = {};
        if (v.effectorIds) {
            res.effectors_ = {
                effector_in: v.effectorIds,
            };
        }
        if (v.paymentTokens) {
            res.paymentToken_in = v.paymentTokens;
        }
        if (v.minPricePerWorkerEpoch) {
            res.pricePerWorkerEpoch_gt = v.minPricePerWorkerEpoch.toString();
        }
        if (v.maxPricePerWorkerEpoch) {
            res.pricePerWorkerEpoch_lt = v.maxPricePerWorkerEpoch.toString();
        }
        if (v.createdAtFrom) {
            res.createdAt_gt = v.createdAtFrom.toString();
        }
        if (v.createdAtTo) {
            res.createdAt_lt = v.createdAtTo.toString();
        }
        if (v.providerId) {
            res.addedComputeUnits_ = { provider: v.providerId };
        }
        return res as Deal_Filter;
    }

    async _getDealsImpl(
        dealsFilters?: DealsFilters,
        offset: number = 0,
        limit: number = this.DEFAULT_PAGE_LIMIT,
        orderBy: DealsShortOrderBy = "createdAt",
        orderType: OrderType = this.DEFAULT_ORDER_TYPE,
    ): Promise<Array<DealShort>> {
        const orderByConverted = this._convertDealShortOrderByToIndexerType(orderBy);
        const filtersConverted = this._convertDealsFiltersToIndexerType(dealsFilters);
        const data = await this.indexerClient.getDeals({
            filters: filtersConverted,
            offset,
            limit,
            orderBy: orderByConverted,
            orderType,
        });
        const res = [];
        if (data) {
            for (const deal of data.deals) {
                res.push(this._composeDealsShort(deal));
            }
        }
        return res;
    }

    _composeDealsShort(deal: BasicDealFragment): DealShort {
        const effectors = this._composeEffectors(deal.effectors);
        return {
            id: deal.id,
            createdAt: deal.createdAt,
            client: deal.owner,
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

    async getDeals(
        dealFilters?: DealsFilters,
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
        const data = await this.indexerClient.getDeal(options);
        let res = null;
        if (data && data.deal) {
            const deal = data.deal;
            res = this._composeDealsShort(deal);
            res["pricePerWorkerEpoch"] = deal.pricePerWorkerEpoch;
            res["computeUnits"] = deal.addedComputeUnits;
            // TODO: resolve whitelists and blacklists.
            res["whitelist"] = [];
            res["blacklist"] = [];
        }
        return res;
    }
}

/*
 * @deprecated: rename to DealExplorerClient
 */
export class DealExplorerClient extends DealExplorerClient {}
