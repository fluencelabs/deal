import { ethers } from "ethers";
import type {
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
  ComputeUnit,
  DealStatus,
  DealShortListView,
  OfferShortListView,
  ProviderShortListView,
  EffectorsOrderBy,
  PaymentTokenOrderBy,
  PaymentToken,
  PaymentTokenListView,
  EffectorListView,
} from "./types.js";
import type {
  ByProviderAndStatusFilter,
  DealsFilters,
  OffersFilters,
  ProvidersFilters,
} from "./filters.js";
import { IndexerClient } from "./indexerClient/indexerClient.js";
import type { BasicOfferFragment } from "./indexerClient/queries/offers-query.generated.js";
import type { ProviderOfProvidersQueryFragment } from "./indexerClient/queries/providers-query.generated.js";
import type {
  Deal_Filter,
  Deal_OrderBy,
  Offer_Filter,
  Offer_OrderBy,
  Provider_Filter,
} from "./indexerClient/generated.types.js";
import type {
  BasicDealFragment,
  ComputeUnitBasicFragment,
} from "./indexerClient/queries/deals-query.generated.js";
import { DealClient } from "../client/client.js";
import type { ContractsENV } from "../client/config.js";
import type { BasicPeerFragment } from "./indexerClient/queries/offers-query.generated.js";
import { DealRpcClient } from "./rpcClients/index.js";
import { tokenValueToRounded, valueToTokenValue } from "./utils.js";

export class FiltersError extends Error {}
export class ValidTogetherFiltersError extends FiltersError {}

/*
 * @dev Currently this client depends on contract artifacts and on subgraph artifacts.
 * @dev It supports mainnet, testnet by selecting related contractsEnv.
 */
export class DealExplorerClient {
  DEFAULT_PAGE_LIMIT = 100;
  DEFAULT_ORDER_TYPE: OrderType = "desc";
  DEFAULT_TOKEN_VALUE_ROUNDING = 3;
  // For MVM we suppose that everything is in USDC.
  //  Used only with filters - if no token selected.
  DEFAULT_FILTER_TOKEN_DECIMALS = 6;
  // Max to select per 1 multiselect filter.
  FILTER_MULTISELECT_MAX = 100;

  private _caller: ethers.Provider | ethers.Signer;
  private _indexerClient: IndexerClient;
  private _dealContractsClient: DealClient;
  private _dealRpcClient: DealRpcClient | null;

  constructor(
    network: ContractsENV,
    chainRpcUrl?: string,
    caller?: ethers.Provider | ethers.Signer,
  ) {
    if (chainRpcUrl) {
      console.warn("Do not use chainRPCUrl, use provider instead.");
      this._caller = new ethers.JsonRpcProvider(chainRpcUrl, undefined, {});
    } else if (caller) {
      this._caller = caller;
    } else {
      throw Error("One of chainRPCUrl or provider should be delclared.");
    }
    this._indexerClient = new IndexerClient(network);
    this._dealContractsClient = new DealClient(this._caller, network);
    this._dealRpcClient = null;
  }

  // Add init other async attributes here.
  // Call before code in every external methods.
  // Currently, it inits only DealRpcClient.
  async _init() {
    if (this._dealRpcClient) {
      return;
    }
    const multicall3Contract = await this._dealContractsClient.getMulticall3();
    const multicall3ContractAddress = await multicall3Contract.getAddress();
    this._dealRpcClient = new DealRpcClient(
      this._caller,
      multicall3ContractAddress,
    );
  }

  _composeProviderBase(
    provider: ProviderOfProvidersQueryFragment,
  ): ProviderBase {
    return {
      id: provider.id,
      createdAt: Number(provider.createdAt),
      totalComputeUnits: provider.computeUnitsTotal,
      freeComputeUnits: provider.computeUnitsAvailable,
      name: provider.name,
      // TODO: add logic for approved.
      isApproved: true,
    } as ProviderBase;
  }

  _composeProviderShort(
    provider: ProviderOfProvidersQueryFragment,
  ): ProviderShort {
    const providerBase = this._composeProviderBase(provider);
    const composedOffers = [];
    if (provider.offers) {
      for (const offer of provider.offers) {
        composedOffers.push(
          this._composeOfferShort(offer as BasicOfferFragment),
        );
      }
    }
    return {
      ...providerBase,
      offers: composedOffers,
    } as ProviderShort;
  }

  async _convertProviderFiltersToIndexer(
    providersFilters?: ProvidersFilters,
  ): Promise<Provider_Filter> {
    if (!providersFilters) {
      return {};
    }
    if (providersFilters.onlyApproved) {
      console.warn("Currently onlyApproved field does not implemented.");
    }
    const convertedFilters: Provider_Filter = { and: [] };
    if (providersFilters.search) {
      const search = providersFilters.search;
      convertedFilters.and?.push({ or: [{ id: search }, { name: search }] });
    }
    // https://github.com/graphprotocol/graph-node/issues/2539
    // https://github.com/graphprotocol/graph-node/issues/4775
    // https://github.com/graphprotocol/graph-node/blob/ad31fd9699b0957abda459340dff093b2a279074/NEWS.md?plain=1#L30
    // Thus, kinda join should be presented on client side =(.
    if (providersFilters.effectorIds) {
      // composedFilters = { offers_: { effectors_: { effector_in: providersFilters.effectorIds } } };
      console.warn("Currently effectorIds filter does not implemented.");
    }
    return convertedFilters;
  }

  /*
   * @dev search: you could perform strict search by `provider address` or `provider name`
   * @dev Note, deprecation:
   */
  async getProviders(
    providersFilters?: ProvidersFilters,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: ProviderShortOrderBy = "createdAt",
    orderType: OrderType = this.DEFAULT_ORDER_TYPE,
  ): Promise<ProviderShortListView> {
    await this._init();
    const composedFilters =
      await this._convertProviderFiltersToIndexer(providersFilters);
    const data = await this._indexerClient.getProviders({
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
    let total = null;
    if (
      !providersFilters &&
      data.graphNetworks.length == 1 &&
      data.graphNetworks[0] &&
      data.graphNetworks[0].providersTotal
    ) {
      total = data.graphNetworks[0].providersTotal as string;
    }
    return {
      data: res,
      total,
    };
  }

  async getProvider(providerId: string): Promise<ProviderDetail | null> {
    await this._init();
    const options = {
      id: providerId,
    };
    const data = await this._indexerClient.getProvider(options);
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
  ): Promise<OfferShortListView> {
    await this._init();
    if (byProviderAndStatusFilter.status) {
      // TODO.
      console.warn("Status filter is not implemented.");
    }
    return await this._getOffersImpl(
      { providerId: byProviderAndStatusFilter.providerId },
      offset,
      limit,
      orderBy,
      orderType,
    );
  }

  async getDealsByProvider(
    byProviderAndStatusFilter: ByProviderAndStatusFilter,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: DealsShortOrderBy = "createdAt",
    orderType: OrderType = this.DEFAULT_ORDER_TYPE,
  ): Promise<DealShortListView> {
    await this._init();
    if (byProviderAndStatusFilter.status) {
      // TODO.
      console.warn("Status filter is not implemented.");
    }
    return await this._getDealsImpl(
      { providerId: byProviderAndStatusFilter.providerId },
      offset,
      limit,
      orderBy,
      orderType,
    );
  }

  _composeEffectors(
    manyToManyEffectors:
      | Array<{ effector: { id: string; description: string } }>
      | null
      | undefined,
  ): Array<Effector> {
    const composedEffectors: Array<Effector> = [];
    if (!manyToManyEffectors) {
      return composedEffectors;
    }
    for (const effector of manyToManyEffectors) {
      composedEffectors.push({
        cid: effector.effector.id,
        description: effector.effector.description,
      });
    }

    return composedEffectors;
  }

  _composeOfferShort(offer: BasicOfferFragment): OfferShort {
    return {
      id: offer.id,
      createdAt: Number(offer.createdAt),
      totalComputeUnits: Number(offer.computeUnitsTotal ?? 0),
      freeComputeUnits: Number(offer.computeUnitsAvailable ?? 0),
      paymentToken: {
        address: offer.paymentToken.id,
        symbol: offer.paymentToken.symbol,
        decimals: offer.paymentToken.decimals.toString(),
      },
      pricePerEpoch: tokenValueToRounded(
        offer.pricePerEpoch,
        this.DEFAULT_TOKEN_VALUE_ROUNDING,
        offer.paymentToken.decimals,
      ),
      effectors: this._composeEffectors(offer.effectors),
      providerId: offer.provider.id,
    };
  }

  _convertOfferShortOrderByToIndexerType(v: OfferShortOrderBy): Offer_OrderBy {
    if (v == "pricePerWorkerEpoch") {
      return "pricePerEpoch" as Offer_OrderBy;
    }
    return v as Offer_OrderBy;
  }

  /*
   * @dev Request indexer for common decimals across tokens, thus,
   * @dev  it checks if symbols across are equal, or throw ValidTogetherFiltersError.
   */
  async _getCommonTokenDecimals(
    tokenAddresses: Array<string>,
  ): Promise<number> {
    if (tokenAddresses.length > this.FILTER_MULTISELECT_MAX) {
      throw new FiltersError("Too many tokens selected per 1 multiselect.");
    }
    const fetched = await this._indexerClient.getTokens({
      filters: { id_in: tokenAddresses },
      limit: this.FILTER_MULTISELECT_MAX,
      orderBy: "id",
      orderType: this.DEFAULT_ORDER_TYPE,
    });
    const tokenModels = fetched.tokens;
    if (tokenModels.length === 0 || tokenModels[0] === undefined) {
      return this.DEFAULT_FILTER_TOKEN_DECIMALS;
    }
    const commonDecimals = tokenModels[0].decimals;
    if (
      tokenModels.some((tokenModel) => tokenModel.decimals !== commonDecimals)
    ) {
      throw new ValidTogetherFiltersError(
        "Tokens have different decimals field. It is impossible to filter them together.",
      );
    }
    return commonDecimals;
  }

  /*
   * @dev We allow to select paymentTokens and range of values for those tokens.
   * @dev If for selected tokens decimals are not at the same: exception will be raised.
   * @dev Thus, on frontend side this "missmatch" should be avoided by checking selected
   * @dev  tokens on equal "decimals" field.
   * @dev [MVM] If no token is selected DEFAULT_FILTER_TOKEN_DECIMALS is applied.
   */
  async _convertOffersFiltersToIndexerType(
    v?: OffersFilters,
  ): Promise<Offer_Filter> {
    if (!v) {
      return {};
    }
    if (v.onlyApproved) {
      console.warn("Currently onlyApproved field does not implemented.");
    }
    const convertedFilters: Offer_Filter = { and: [] };
    if (v.search) {
      const search = v.search;
      convertedFilters.and?.push({
        or: [{ id: search }, { provider: search }],
      });
    }
    if (v.effectorIds) {
      convertedFilters.and?.push({
        effectors_: { effector_in: v.effectorIds },
      });
    }
    if (v.createdAtFrom) {
      convertedFilters.and?.push({ createdAt_gte: v.createdAtFrom.toString() });
    }
    if (v.createdAtTo) {
      convertedFilters.and?.push({ createdAt_lte: v.createdAtTo.toString() });
    }
    if (v.providerId) {
      convertedFilters.and?.push({ provider: v.providerId });
    }
    // Filters with relation check below.
    let tokenDecimals = this.DEFAULT_FILTER_TOKEN_DECIMALS;
    if (v.paymentTokens) {
      convertedFilters.and?.push({ paymentToken_in: v.paymentTokens });
    }
    if (
      (v.minPricePerWorkerEpoch || v.maxPricePerWorkerEpoch) &&
      v.paymentTokens
    ) {
      tokenDecimals = await this._getCommonTokenDecimals(v.paymentTokens);
    }
    if (v.minPricePerWorkerEpoch) {
      convertedFilters.and?.push({
        pricePerEpoch_gte: valueToTokenValue(
          v.minPricePerWorkerEpoch,
          tokenDecimals,
        ),
      });
    }
    if (v.maxPricePerWorkerEpoch) {
      convertedFilters.and?.push({
        pricePerEpoch_lte: valueToTokenValue(
          v.maxPricePerWorkerEpoch,
          tokenDecimals,
        ),
      });
    }
    return convertedFilters;
  }

  async _getOffersImpl(
    offerFilters?: OffersFilters,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: OfferShortOrderBy = "createdAt",
    orderType: OrderType = this.DEFAULT_ORDER_TYPE,
  ): Promise<OfferShortListView> {
    const orderByConverted =
      this._convertOfferShortOrderByToIndexerType(orderBy);
    const filtersConverted =
      await this._convertOffersFiltersToIndexerType(offerFilters);
    const data = await this._indexerClient.getOffers({
      filters: filtersConverted,
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
    let total = null;
    if (
      !offerFilters &&
      data.graphNetworks.length == 1 &&
      data.graphNetworks[0] &&
      data.graphNetworks[0].offersTotal
    ) {
      total = data.graphNetworks[0].offersTotal as string;
    }
    return {
      data: res,
      total,
    };
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
   */
  async getOffers(
    offerFilters?: OffersFilters,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: OfferShortOrderBy = "createdAt",
    orderType: OrderType = this.DEFAULT_ORDER_TYPE,
  ): Promise<OfferShortListView> {
    await this._init();
    return await this._getOffersImpl(
      offerFilters,
      offset,
      limit,
      orderBy,
      orderType,
    );
  }

  _composePeers(peers: Array<BasicPeerFragment>): Array<Peer> {
    const peersComposed: Array<Peer> = [];
    if (peers) {
      for (const peer of peers) {
        peersComposed.push({
          id: peer.id,
          offerId: peer.offer.id,
          computeUnits: peer.computeUnits
            ? this._composeComputeUnits(
                peer.computeUnits as Array<ComputeUnitBasicFragment>,
              )
            : [],
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
    const data = await this._indexerClient.getOffer(options);
    let res: OfferDetail | null = null;
    if (data && data.offer) {
      res = {
        ...this._composeOfferShort(data.offer),
        peers: this._composePeers(data.offer.peers as Array<BasicPeerFragment>),
        updatedAt: Number(data.offer.updatedAt),
      };
    }
    return res;
  }

  _convertDealShortOrderByToIndexerType(v: DealsShortOrderBy): Deal_OrderBy {
    // Currently no needs in convert because only createdAt.
    return v as Deal_OrderBy;
  }

  async _convertDealsFiltersToIndexerType(
    v?: DealsFilters,
  ): Promise<Deal_Filter> {
    if (!v) {
      return {};
    }
    if (v.onlyApproved) {
      console.warn("Currently onlyApproved filter does not implemented.");
    }
    if (v.status) {
      console.warn("Currently status filter does not implemented.");
    }
    const convertedFilters: Deal_Filter = { and: [] };
    if (v.search) {
      const search = v.search;
      convertedFilters.and?.push({ or: [{ id: search }, { owner: search }] });
    }
    if (v.effectorIds) {
      convertedFilters.and?.push({
        effectors_: { effector_in: v.effectorIds },
      });
    }
    if (v.createdAtFrom) {
      convertedFilters.and?.push({ createdAt_gte: v.createdAtFrom.toString() });
    }
    if (v.createdAtTo) {
      convertedFilters.and?.push({ createdAt_lte: v.createdAtTo.toString() });
    }
    if (v.providerId) {
      convertedFilters.and?.push({
        addedComputeUnits_: { provider: v.providerId },
      });
    }
    // Filters with relation check below.
    let tokenDecimals = this.DEFAULT_FILTER_TOKEN_DECIMALS;
    if (v.paymentTokens) {
      convertedFilters.and?.push({ paymentToken_in: v.paymentTokens });
    }
    if (
      (v.minPricePerWorkerEpoch || v.maxPricePerWorkerEpoch) &&
      v.paymentTokens
    ) {
      tokenDecimals = await this._getCommonTokenDecimals(v.paymentTokens);
    }
    if (v.minPricePerWorkerEpoch) {
      convertedFilters.and?.push({
        pricePerWorkerEpoch_gte: valueToTokenValue(
          v.minPricePerWorkerEpoch,
          tokenDecimals,
        ),
      });
    }
    if (v.maxPricePerWorkerEpoch) {
      convertedFilters.and?.push({
        pricePerWorkerEpoch_lte: valueToTokenValue(
          v.maxPricePerWorkerEpoch,
          tokenDecimals,
        ),
      });
    }
    return convertedFilters;
  }

  async _getDealsImpl(
    dealsFilters?: DealsFilters,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: DealsShortOrderBy = "createdAt",
    orderType: OrderType = this.DEFAULT_ORDER_TYPE,
  ): Promise<DealShortListView> {
    await this._init();

    const orderByConverted =
      this._convertDealShortOrderByToIndexerType(orderBy);
    const filtersConverted =
      await this._convertDealsFiltersToIndexerType(dealsFilters);
    const data = await this._indexerClient.getDeals({
      filters: filtersConverted,
      offset,
      limit,
      orderBy: orderByConverted,
      orderType,
    });
    const res = [];
    if (data) {
      const dealAddresses = data.deals.map((deal) => {
        return deal.id;
      });
      // Use several n feature calls instead of limit * n calls to rpc.
      const dealStatuses: Array<DealStatus> =
        await this._dealRpcClient!.getStatusDealBatch(dealAddresses);
      const freeBalances: Array<bigint | null> =
        await this._dealRpcClient!.getFreeBalanceDealBatch(dealAddresses);

      for (let i = 0; i < data.deals.length; i++) {
        const deal = data.deals[i] as BasicDealFragment;
        res.push(
          this._composeDealsShort(deal, {
            dealStatus: dealStatuses[i],
            freeBalance: freeBalances[i],
          }),
        );
      }
    }
    let total = null;
    if (
      !dealsFilters &&
      data.graphNetworks.length == 1 &&
      data.graphNetworks[0] &&
      data.graphNetworks[0].dealsTotal
    ) {
      total = data.graphNetworks[0].dealsTotal as string;
    }
    return {
      data: res,
      total,
    };
  }

  _composeDealsShort(
    deal: BasicDealFragment,
    fromRpcForDealShort: {
      dealStatus: DealStatus | undefined;
      freeBalance: bigint | null | undefined;
    },
  ): DealShort {
    const freeBalance = fromRpcForDealShort.freeBalance
      ? fromRpcForDealShort.freeBalance
      : BigInt(0);
    const totalEarnings =
      BigInt(deal.depositedSum) - BigInt(deal.withdrawalSum) - freeBalance;

    return {
      id: deal.id,
      createdAt: Number(deal.createdAt),
      client: deal.owner,
      minWorkers: deal.minWorkers,
      targetWorkers: deal.targetWorkers,
      paymentToken: {
        address: deal.paymentToken.id,
        symbol: deal.paymentToken.symbol,
        decimals: deal.paymentToken.decimals.toString(),
      },
      balance: tokenValueToRounded(
        freeBalance,
        this.DEFAULT_TOKEN_VALUE_ROUNDING,
        deal.paymentToken.decimals,
      ),
      status: fromRpcForDealShort.dealStatus
        ? fromRpcForDealShort.dealStatus
        : "active",
      totalEarnings: tokenValueToRounded(
        totalEarnings,
        this.DEFAULT_TOKEN_VALUE_ROUNDING,
        deal.paymentToken.decimals,
      ),
      // TODO: add missed implementations.
      registeredWorkers: 0,
      matchedWorkers: 0,
    };
  }

  async getDeals(
    dealFilters?: DealsFilters,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: DealsShortOrderBy = "createdAt",
    orderType: OrderType = this.DEFAULT_ORDER_TYPE,
  ): Promise<DealShortListView> {
    return await this._getDealsImpl(
      dealFilters,
      offset,
      limit,
      orderBy,
      orderType,
    );
  }

  // It composes only compute units with linked workerIds.
  _composeComputeUnits(
    fetchedComputeUnits: Array<ComputeUnitBasicFragment>,
  ): Array<ComputeUnit> {
    const res: Array<ComputeUnit> = [];
    for (const fetched of fetchedComputeUnits) {
      if (fetched.workerId) {
        res.push({
          id: fetched.id,
          workerId: fetched.workerId,
        });
      }
    }
    return res;
  }

  async getDeal(dealId: string): Promise<DealDetail | null> {
    await this._init();
    const options = {
      id: dealId,
    };
    const data = await this._indexerClient.getDeal(options);
    let res: DealDetail | null = null;
    if (data && data.deal) {
      const deal = data.deal;
      const dealStatus = (
        await this._dealRpcClient!.getStatusDealBatch([dealId])
      )[0];
      const freeBalance = (
        await this._dealRpcClient!.getFreeBalanceDealBatch([dealId])
      )[0];
      const effectors = this._composeEffectors(deal.effectors);
      res = {
        ...this._composeDealsShort(deal, { dealStatus, freeBalance }),
        pricePerWorkerEpoch: tokenValueToRounded(
          deal.pricePerWorkerEpoch,
          this.DEFAULT_TOKEN_VALUE_ROUNDING,
          deal.paymentToken.decimals,
        ),
        maxWorkersPerProvider: deal.maxWorkersPerProvider,
        computeUnits: this._composeComputeUnits(
          deal.addedComputeUnits as Array<ComputeUnitBasicFragment>,
        ),
        // TODO: resolve whitelists and blacklists.
        whitelist: [],
        blacklist: [],
        effectors: effectors,
      };
    }
    return res;
  }

  async getEffectors(
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: EffectorsOrderBy = "id",
    orderType: OrderType = this.DEFAULT_ORDER_TYPE,
  ): Promise<EffectorListView> {
    const data = await this._indexerClient.getEffectors({
      offset,
      limit,
      orderBy,
      orderType,
    });
    let res: Array<Effector> = [];
    if (data) {
      // data.deals.map(deal => { return deal.id })
      res = data.effectors.map((effector) => {
        return { cid: effector.id, description: effector.description };
      });
    }
    let total = null;
    if (
      data.graphNetworks.length == 1 &&
      data.graphNetworks[0] &&
      data.graphNetworks[0].effectorsTotal
    ) {
      total = data.graphNetworks[0].effectorsTotal as string;
    }
    return {
      data: res,
      total,
    };
  }

  async getPaymentTokens(
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: PaymentTokenOrderBy = "symbol",
    orderType: OrderType = this.DEFAULT_ORDER_TYPE,
  ): Promise<PaymentTokenListView> {
    const data = await this._indexerClient.getTokens({
      offset,
      limit,
      orderBy,
      orderType,
    });
    let res: Array<PaymentToken> = [];
    if (data) {
      // data.deals.map(deal => { return deal.id })
      res = data.tokens.map((token) => {
        return {
          address: token.id,
          symbol: token.symbol,
          decimals: token.decimals.toString(),
        };
      });
    }
    let total = null;
    if (
      data.graphNetworks.length == 1 &&
      data.graphNetworks[0] &&
      data.graphNetworks[0].tokensTotal
    ) {
      total = data.graphNetworks[0].tokensTotal as string;
    }
    return {
      data: res,
      total,
    };
  }
}

/*
 * @deprecated: rename to DealExplorerClient
 */
export class DealIndexerClient extends DealExplorerClient {}
