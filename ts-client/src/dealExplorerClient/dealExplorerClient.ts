// All main view methods consist of notice docstring to refer to Figma screen
//  e.g. // @notice [Figma] Deal.
// @dev There is a lot of "total: null," in the code - we await subgraph feature:
//  return counter of filtration (currently 14.02.24 it is impossible).
import { ethers } from "ethers";
import type {
  CapacityCommitmentDetail,
  CapacityCommitmentListView,
  CapacityCommitmentShort,
  CapacityCommitmentStatus,
  DealDetail,
  DealShortListView,
  DealStatus,
  Effector,
  EffectorListView,
  OfferDetail,
  OfferShortListView,
  PaymentToken,
  PaymentTokenListView,
  PeerDetail,
  DealByPeer,
  DealsByPeerListView,
  ProviderDetail,
  ProviderShortListView,
  ComputeUnitDetail,
  ProofBasicListView,
  ProofBasic,
  ProofStatsByCapacityCommitmentListView,
  ProofStatsByCapacityCommitment,
  ComputeUnitStatsPerCapacityCommitmentEpoch,
  ComputeUnitStatsPerCapacityCommitmentEpochListView,
  ComputeUnitWorkerDetail,
  ComputeUnitWorkerDetailListView,
  ComputeUnitsWithCCStatusListView,
} from "./types/schemes.js";
import type {
  ChildEntitiesByProviderFilter,
  CapacityCommitmentsFilters,
  CapacityCommitmentsOrderBy,
  DealsFilters,
  DealsShortOrderBy,
  EffectorsOrderBy,
  OffersFilters,
  OfferShortOrderBy,
  OrderType,
  PaymentTokenOrderBy,
  ProvidersFilters,
  ProviderShortOrderBy,
  ProofsFilters,
  ProofsOrderBy,
  ComputeUnitsOrderBy,
  ProofStatsByCapacityCommitmentOrderBy,
  ComputeUnitStatsPerCapacityCommitmentEpochOrderBy,
  ChildEntitiesByPeerFilter,
} from "./types/filters.js";
import { IndexerClient } from "./indexerClient/indexerClient.js";
import type {
  BasicDealFragment,
  ComputeUnitBasicFragment,
} from "./indexerClient/queries/deals-query.generated.js";
import { DealClient } from "../client/client.js";
import type { ContractsENV } from "../client/config.js";
import type { BasicPeerFragment } from "./indexerClient/queries/offers-query.generated.js";
import { DealRpcClient } from "./rpcClients/index.js";
import {
  calculateEpoch,
  DEFAULT_ORDER_TYPE,
  FILTER_MULTISELECT_MAX,
  type SerializationSettings,
  tokenValueToRounded,
} from "./utils.js";
import {
  serializeCUStatus,
  serializeEffectorDescription,
} from "./serializers/logics.js";
import { serializeDealProviderAccessLists } from "../utils/serializers.js";
import {
  FiltersError,
  serializeCapacityCommitmentsFiltersToIndexer,
  serializeDealsFiltersToIndexer,
  serializeOffersFiltersToIndexerType,
  serializeProofsFiltersToIndexer,
  serializeProviderFiltersToIndexer,
  ValidTogetherFiltersError,
} from "./serializers/filters.js";
import {
  serializeCapacityCommitmentDetail,
  serializeCapacityCommitmentShort,
  serializeComputeUnits,
  serializeComputeUnitsWithStatus,
  serializeDealsShort,
  serializeEffectors,
  serializeOfferShort,
  serializePeers,
  serializeProviderBase,
  serializeProviderShort,
} from "./serializers/schemes.js";
import {
  serializeCapacityCommitmentsOrderByToIndexer,
  serializeDealShortOrderByToIndexer,
  serializeOfferShortOrderByToIndexer,
  serializeProofsOrderByToIndexer,
} from "./serializers/orderby.js";
import type { ICapacity } from "../typechain-types/index.js";
import type { CapacityCommitmentBasicFragment } from "./indexerClient/queries/capacity-commitments-query.generated.js";
import { FLTToken } from "./constants.js";

/*
 * @dev Currently this client depends on contract artifacts and on subgraph artifacts.
 * @dev It supports kras, stage, testnet, local by selecting related contractsEnv.
 */
export class DealExplorerClient {
  DEFAULT_PAGE_LIMIT = 100;
  // For MVM we suppose that everything is in USDC.
  //  Used only with filters - if no token selected.
  DEFAULT_FILTER_TOKEN_DECIMALS = 6;

  private _caller: ethers.Provider | ethers.Signer;
  private _indexerClient: IndexerClient;
  private _dealContractsClient: DealClient;
  private _dealRpcClient: DealRpcClient | null;
  private _coreEpochDuration: number | null;
  private _coreInitTimestamp: number | null;
  private _capacityContract: ICapacity | null;
  private _capacityContractAddress: string | null;
  private _capacityMinRequiredProofsPerEpoch: number | null;
  private _serializationSettings: SerializationSettings;

  constructor(
    network: ContractsENV,
    chainRpcUrl?: string,
    caller?: ethers.Provider | ethers.Signer,
    serializationSettings?: SerializationSettings,
  ) {
    if (chainRpcUrl) {
      console.warn("Do not use chainRPCUrl, use provider instead.");
      this._caller = new ethers.JsonRpcProvider(chainRpcUrl, undefined, {});
    } else if (caller) {
      this._caller = caller;
    } else {
      throw Error("One of chainRPCUrl or provider should be delclared.");
    }
    if (serializationSettings) {
      this._serializationSettings = serializationSettings;
    } else {
      this._serializationSettings = {
        parseNativeTokenToFixedDefault: 18,
        parseTokenToFixedDefault: 3,
      };
    }
    this._indexerClient = new IndexerClient(network);
    this._dealContractsClient = new DealClient(this._caller, network);
    // Fields to init() are declared below.
    this._dealRpcClient = null;
    this._coreEpochDuration = null;
    this._coreInitTimestamp = null;
    this._capacityContract = null;
    this._capacityContractAddress = null;
    this._capacityMinRequiredProofsPerEpoch = null;
  }

  // Add init other async attributes here.
  // Call before code in every external methods.
  // Currently, it inits:
  // - DealRpcClient multicall3Contract
  // - fetches core constants from indexer.
  async _init() {
    // Check if already inited - early return.
    if (this._dealRpcClient && this._capacityContract) {
      return;
    }
    console.info(`[DealExplorerClient] Init client...`);
    const multicall3Contract = this._dealContractsClient.getMulticall3();
    const multicall3ContractAddress = await multicall3Contract.getAddress();
    this._dealRpcClient = new DealRpcClient(
      this._caller,
      multicall3ContractAddress,
    );
    this._capacityContract = this._dealContractsClient.getCapacity();
    this._capacityContractAddress = await this._capacityContract.getAddress();

    // Init constants from indexer.
    // TODO: add cache.
    if (
      this._coreEpochDuration == null ||
      this._coreInitTimestamp == null ||
      this._capacityMinRequiredProofsPerEpoch == null
    ) {
      console.info("Fetch contract constants from indexer.");
      const data = await this._indexerClient.getContractConstants();
      if (
        data.graphNetworks.length != 1 ||
        data.graphNetworks[0] == undefined
      ) {
        throw new Error(
          "Assertion: data.graphNetworks.length != 1 || data.graphNetworks[0] == undefined.",
        );
      }
      this._coreInitTimestamp = Number(data.graphNetworks[0].initTimestamp);
      this._coreEpochDuration = Number(data.graphNetworks[0].coreEpochDuration);
      this._capacityMinRequiredProofsPerEpoch = Number(
        data.graphNetworks[0].minRequiredProofsPerEpoch,
      );
    }
  }

  /*
   * @dev Request indexer for common decimals across tokens, thus,
   * @dev  it checks if symbols across are equal, or throw ValidTogetherFiltersError.
   */
  async _getCommonTokenDecimals(
    tokenAddresses: Array<string>,
  ): Promise<number> {
    if (tokenAddresses.length > FILTER_MULTISELECT_MAX) {
      throw new FiltersError("Too many tokens selected per 1 multiselect.");
    }
    const fetched = await this._indexerClient.getTokens({
      filters: { id_in: tokenAddresses },
      limit: FILTER_MULTISELECT_MAX,
      orderBy: "id",
      orderType: DEFAULT_ORDER_TYPE,
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
   * @notice [Figma] Compute Provider List.
   * @dev search: you could perform strict search by `provider address` or `provider name`
   * @dev Note, deprecation:
   */
  async getProviders(
    providersFilters?: ProvidersFilters,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: ProviderShortOrderBy = "createdAt",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
  ): Promise<ProviderShortListView> {
    await this._init();
    const composedFilters =
      await serializeProviderFiltersToIndexer(providersFilters);
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
        res.push(serializeProviderShort(provider, this._serializationSettings));
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

  // @notice [Figma] Provider Info
  async getProvider(providerId: string): Promise<ProviderDetail | null> {
    await this._init();
    const options = {
      id: providerId,
    };
    const data = await this._indexerClient.getProvider(options);
    let res = null;
    if (data && data.provider) {
      const providerFetched = data.provider;
      const providerBase = serializeProviderBase(providerFetched);
      res = {
        ...providerBase,
        peerCount: providerFetched.peerCount,
      };
    }
    return res;
  }

  // @notice [Figma] Provider Offers List.
  async getOffersByProvider(
    offersByProviderFilter: ChildEntitiesByProviderFilter,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: OfferShortOrderBy = "createdAt",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
  ): Promise<OfferShortListView> {
    await this._init();

    const convertedFilters: OffersFilters = {
      providerId: offersByProviderFilter.providerId.toLowerCase(),
    };
    if (
      offersByProviderFilter.status &&
      offersByProviderFilter.status != "all"
    ) {
      convertedFilters.status = offersByProviderFilter.status;
    }
    return await this._getOffersImpl(
      convertedFilters,
      offset,
      limit,
      orderBy,
      orderType,
    );
  }

  // @notice [Figma] Provider Deals.
  async getDealsByProvider(
    dealsByProviderFilter: ChildEntitiesByProviderFilter,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: DealsShortOrderBy = "createdAt",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
  ): Promise<DealShortListView> {
    await this._init();

    if (dealsByProviderFilter.status && dealsByProviderFilter.status != "all") {
      console.warn("Filter deals by status if not implemented.");
    }
    return await this._getDealsImpl(
      { providerId: dealsByProviderFilter.providerId.toLowerCase() },
      offset,
      limit,
      orderBy,
      orderType,
    );
  }

  // @notice [Figma] Provider Capacity.
  async getCapacityCommitmentsByProvider(
    capacityCommitmentsByProviderFilter: ChildEntitiesByProviderFilter,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: CapacityCommitmentsOrderBy = "createdAt",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
  ) {
    await this._init();
    const convertedFilters: CapacityCommitmentsFilters = {
      search: capacityCommitmentsByProviderFilter.providerId.toLowerCase(),
    };
    if (
      capacityCommitmentsByProviderFilter.status &&
      capacityCommitmentsByProviderFilter.status != "all"
    ) {
      convertedFilters.status = capacityCommitmentsByProviderFilter.status;
    }
    return await this._getCapacityCommitmentsImpl(
      convertedFilters,
      offset,
      limit,
      orderBy,
      orderType,
    );
  }

  // @notice [Figma] Peer ID. Capacity Commitments.
  async getCapacityCommitmentsByPeer(
    capacityCommitmentsByProviderFilter: ChildEntitiesByPeerFilter,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: CapacityCommitmentsOrderBy = "createdAt",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
  ) {
    await this._init();
    const convertedFilters: CapacityCommitmentsFilters = {
      search: capacityCommitmentsByProviderFilter.peerId,
    };
    if (
      capacityCommitmentsByProviderFilter.status &&
      capacityCommitmentsByProviderFilter.status != "all"
    ) {
      convertedFilters.status = capacityCommitmentsByProviderFilter.status;
    }
    return await this._getCapacityCommitmentsImpl(
      convertedFilters,
      offset,
      limit,
      orderBy,
      orderType,
    );
  }

  async _calculateTokenDecimalsForFilters(
    paymentTokens: Array<string> | undefined,
    otherConditions: boolean | undefined,
  ) {
    let tokenDecimals = this.DEFAULT_FILTER_TOKEN_DECIMALS;
    if (paymentTokens) {
      const paymentTokensLowerCase = paymentTokens.map((tokenAddress) => {
        return tokenAddress.toLowerCase();
      });
      if (otherConditions && paymentTokensLowerCase.length > 1) {
        tokenDecimals = await this._getCommonTokenDecimals(
          paymentTokensLowerCase,
        );
      }
    }
    return tokenDecimals;
  }

  async _getOffersImpl(
    offerFilters?: OffersFilters,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: OfferShortOrderBy = "createdAt",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
  ): Promise<OfferShortListView> {
    const orderByConverted = serializeOfferShortOrderByToIndexer(orderBy);

    const _cond =
      (offerFilters?.minPricePerWorkerEpoch ||
        offerFilters?.maxPricePerWorkerEpoch) !== undefined;
    const commonTokenDecimals = await this._calculateTokenDecimalsForFilters(
      offerFilters?.paymentTokens,
      _cond,
    );

    const filtersConverted = await serializeOffersFiltersToIndexerType(
      offerFilters,
      commonTokenDecimals,
    );
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
        res.push(serializeOfferShort(offer, this._serializationSettings));
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
   * @notice [Figma] List of Offers.
   * @dev Get offers list for 1 page and specified filters.
   */
  async getOffers(
    offerFilters?: OffersFilters,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: OfferShortOrderBy = "createdAt",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
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

  /*
   * @notice [Figma] Offer.
   */
  async getOffer(offerId: string): Promise<OfferDetail | null> {
    const options = {
      id: offerId,
    };
    const data = await this._indexerClient.getOffer(options);
    let res: OfferDetail | null = null;
    if (data && data.offer) {
      res = {
        ...serializeOfferShort(data.offer, this._serializationSettings),
        peers: serializePeers(data.offer.peers as Array<BasicPeerFragment>),
        updatedAt: Number(data.offer.updatedAt),
      };
    }
    return res;
  }

  async _getDealsImpl(
    dealsFilters?: DealsFilters,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: DealsShortOrderBy = "createdAt",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
  ): Promise<DealShortListView> {
    await this._init();

    const orderByConverted = serializeDealShortOrderByToIndexer(orderBy);

    const _cond =
      (dealsFilters?.minPricePerWorkerEpoch ||
        dealsFilters?.maxPricePerWorkerEpoch) !== undefined;
    const commonTokenDecimals = await this._calculateTokenDecimalsForFilters(
      dealsFilters?.paymentTokens,
      _cond,
    );

    const filtersConverted = await serializeDealsFiltersToIndexer(
      dealsFilters,
      commonTokenDecimals,
    );
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
          serializeDealsShort(
            deal,
            {
              dealStatus: dealStatuses[i],
              freeBalance: freeBalances[i],
            },
            this._serializationSettings,
          ),
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

  // @notice [Figma] List of Deals.
  async getDeals(
    dealFilters?: DealsFilters,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: DealsShortOrderBy = "createdAt",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
  ): Promise<DealShortListView> {
    return await this._getDealsImpl(
      dealFilters,
      offset,
      limit,
      orderBy,
      orderType,
    );
  }

  // @notice [Figma] Deal. Matching Result.
  async getComputeUnitsByDeal(
    dealId: string,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: ComputeUnitsOrderBy = "createdAt",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
  ): Promise<ComputeUnitWorkerDetailListView> {
    await this._init();

    const data = await this._indexerClient.getComputeUnits({
      filters: {
        deal_: { id: dealId },
      },
      offset,
      limit,
      orderBy,
      orderType,
    });

    let res: Array<ComputeUnitWorkerDetail> = [];
    for (const computeUnit of data.computeUnits) {
      res.push({
        id: computeUnit.id,
        providerId: computeUnit.peer.provider.id,
        workerId: computeUnit.workerId ?? undefined,
        workerStatus: computeUnit.workerId
          ? "registered"
          : "waitingRegistration",
      });
    }

    return {
      total: null,
      data: res,
    };
  }

  // @notice [Figma] Deal.
  async getDeal(dealId: string): Promise<DealDetail | null> {
    await this._init();
    const options = {
      id: dealId.toLowerCase(),
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
      const effectors = serializeEffectors(deal.effectors);
      const { whitelist, blacklist } = serializeDealProviderAccessLists(
        deal.providersAccessType,
        deal.providersAccessList,
      );
      res = {
        ...serializeDealsShort(
          deal,
          { dealStatus, freeBalance },
          this._serializationSettings,
        ),
        // USDC.
        pricePerWorkerEpoch: tokenValueToRounded(
          deal.pricePerWorkerEpoch,
          this._serializationSettings.parseTokenToFixedDefault,
          deal.paymentToken.decimals,
        ),
        maxWorkersPerProvider: deal.maxWorkersPerProvider,
        computeUnits: serializeComputeUnits(
          deal.addedComputeUnits as Array<ComputeUnitBasicFragment>,
        ),
        whitelist,
        blacklist,
        effectors: effectors,
      };
    }
    return res;
  }

  // @dev To fetch all effectors for multiselect filter.
  async getEffectors(
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: EffectorsOrderBy = "id",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
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
        return {
          cid: effector.id,
          description: serializeEffectorDescription(
            effector.id,
            effector.description,
          ),
        };
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

  // @dev To fetch all payment tokens for multiselect filter.
  async getPaymentTokens(
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: PaymentTokenOrderBy = "symbol",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
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

  async _getCapacityCommitmentsImpl(
    filters?: CapacityCommitmentsFilters,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: CapacityCommitmentsOrderBy = "createdAt",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
  ): Promise<CapacityCommitmentListView> {
    const orderBySerialized =
      serializeCapacityCommitmentsOrderByToIndexer(orderBy);

    let currentEpoch = undefined;
    if (
      filters?.onlyActive ||
      filters?.status == "active" ||
      filters?.status == "inactive"
    ) {
      if (this._coreInitTimestamp == null || this._coreEpochDuration == null) {
        throw new Error("Assertion: Class object was not inited correctly.");
      }
      currentEpoch = calculateEpoch(
        Date.now() / 1000,
        this._coreInitTimestamp,
        this._coreEpochDuration,
      ).toString();
    }

    const filtersSerialized = serializeCapacityCommitmentsFiltersToIndexer(
      filters,
      currentEpoch,
    );
    const data = await this._indexerClient.getCapacityCommitments({
      filters: filtersSerialized,
      offset,
      limit,
      orderBy: orderBySerialized,
      orderType,
    });
    const res: Array<CapacityCommitmentShort> = [];

    if (data) {
      if (
        data.graphNetworks.length != 1 ||
        data.graphNetworks[0] == undefined
      ) {
        throw new Error(
          "Assertion: data.graphNetworks.length != 1 || data.graphNetworks[0] == undefined.",
        );
      }

      const capacityComitmentIds: Array<string> = data.capacityCommitments.map(
        (capacityCommitment) => {
          return capacityCommitment.id;
        },
      );
      const capacityCommitmentsStatuses: Array<CapacityCommitmentStatus> =
        await this._dealRpcClient!.getStatusCapacityCommitmentsBatch(
          this._capacityContractAddress!,
          capacityComitmentIds,
        );

      for (let i = 0; i < data.capacityCommitments.length; i++) {
        const capacityCommitment = data.capacityCommitments[
          i
        ] as CapacityCommitmentBasicFragment;

        res.push(
          serializeCapacityCommitmentShort(
            capacityCommitment,
            capacityCommitmentsStatuses[i] ?? "undefined",
            this._coreInitTimestamp!,
            this._coreEpochDuration!,
          ),
        );
      }
    }
    // TODO: generalize code below.
    let total = null;
    if (
      data.graphNetworks.length == 1 &&
      data.graphNetworks[0] &&
      data.graphNetworks[0].capacityCommitmentsTotal
    ) {
      total = data.graphNetworks[0].capacityCommitmentsTotal as string;
    }
    return {
      data: res,
      total,
    };
  }

  // @notice [Figma] List of capacity.
  async getCapacityCommitments(
    filters?: CapacityCommitmentsFilters,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: CapacityCommitmentsOrderBy = "createdAt",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
  ): Promise<CapacityCommitmentListView> {
    await this._init();

    return await this._getCapacityCommitmentsImpl(
      filters,
      offset,
      limit,
      orderBy,
      orderType,
    );
  }

  // @notice [Figma] Capacity Commitment.
  async getCapacityCommitment(
    capacityCommitmentId: string,
  ): Promise<CapacityCommitmentDetail | null> {
    await this._init();
    const options = {
      id: capacityCommitmentId,
    };
    const data = await this._indexerClient.getCapacityCommitment(options);
    if (!data || !data.capacityCommitment) {
      return null;
    }

    const capacityCommitment = data.capacityCommitment;
    const capacityCommitmentRpcDetails =
      await this._dealRpcClient!.getCapacityCommitmentDetails(
        this._capacityContractAddress!,
        capacityCommitment.id,
      );

    return serializeCapacityCommitmentDetail(
      capacityCommitment,
      capacityCommitmentRpcDetails.status,
      this._coreInitTimestamp!,
      this._coreEpochDuration!,
      capacityCommitment.totalCollateral,
      capacityCommitment.rewardDelegatorRate,
      capacityCommitmentRpcDetails.unlockedRewards,
      capacityCommitmentRpcDetails.totalRewards,
      capacityCommitment.rewardWithdrawn,
      capacityCommitment.delegator,
      this._serializationSettings,
    );
  }

  // @notice [Figma] Peer ID.
  async getPeer(peerId: string): Promise<PeerDetail | null> {
    await this._init();
    const data = await this._indexerClient.getPeer({ id: peerId });
    if (!data || !data.peer) {
      return null;
    }
    const peer = data.peer;

    return {
      id: peer.id,
      providerId: peer.provider.id,
      offerId: peer.offer.id,
      computeUnitsInDeal: peer.computeUnitsInDeal,
      computeUnitsInCapacityCommitment: peer.currentCapacityCommitment
        ? peer.currentCapacityCommitment?.activeUnitCount
        : 0,
      computeUnitsTotal: peer.computeUnitsTotal,
    };
  }

  // @notice [Figma] Peer ID: Deals.
  async getDealsByPeer(
    peerId: string,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: "id",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
  ): Promise<DealsByPeerListView> {
    await this._init();
    // TODO: ClientError: Failed to get entities from store: SortKey::ChildKey cannot be used for parent ordering (yet).
    console.warn(
      `orderBy & orderType params are not supported yet. Thus, ${orderBy} & ${orderType} are ignored.`,
    );
    const data = await this._indexerClient.getPeerDeals({
      peerId: peerId,
      dealsOffset: offset,
      dealsLimit: limit,
      dealsOrderBy: null,
      dealsOrderType: null,
    });

    if (
      data.peer == undefined ||
      data.peer.joinedDeals == undefined ||
      data.peer.joinedDeals.length == 0
    ) {
      return {
        data: [],
        total: null,
      };
    }

    let res: Array<DealByPeer> = [];
    for (let i = 0; i < data.peer.joinedDeals.length; i++) {
      const peerDeal = data.peer.joinedDeals[i];
      if (peerDeal == undefined) {
        throw new Error("Assertion: peerDeal == undefined.");
      }
      if (
        !peerDeal.deal.addedComputeUnits ||
        peerDeal.deal.addedComputeUnits.length != 1 ||
        peerDeal.deal.addedComputeUnits[0] == undefined
      ) {
        // Logically fetched deals of the peer could not have more than 1 CU (protocol restriction).
        throw new Error(
          `Assertion: peerDeal.deal.addedComputeUnits.length != 1 || peerDeal.deal.addedComputeUnits[0] == undefined. peerDeal.deal.addedComputeUnits: ${peerDeal.deal.addedComputeUnits}`,
        );
      }
      const firstCU = peerDeal.deal.addedComputeUnits[0];
      res.push({
        dealId: peerDeal.deal.id,
        computeUnitId: firstCU.id!,
        workerId: firstCU.workerId!,
      });
    }
    return {
      total: null,
      data: res,
    };
  }

  // @notice [Figma] Compute Unit.
  async getComputeUnit(
    computeUnitId: string,
  ): Promise<ComputeUnitDetail | null> {
    await this._init();

    const data = await this._indexerClient.getComputeUnit({
      id: computeUnitId,
    });
    if (!data || !data.computeUnit) {
      return null;
    }
    const computeUnit = data.computeUnit;

    const { status } = serializeCUStatus(computeUnit);
    const currentPeerCapacityCommitment =
      computeUnit.peer.currentCapacityCommitment;

    return {
      id: computeUnit.id,
      workerId: computeUnit.workerId ?? undefined,
      providerId: computeUnit.provider.id,
      currentCommitmentId: currentPeerCapacityCommitment?.id,
      peerId: computeUnit.peer.id,
      // FLT.
      collateral: currentPeerCapacityCommitment
        ? tokenValueToRounded(
            currentPeerCapacityCommitment.collateralPerUnit,
            this._serializationSettings.parseNativeTokenToFixedDefault,
          )
        : "0",
      successProofs: currentPeerCapacityCommitment
        ? currentPeerCapacityCommitment.submittedProofsCount
        : 0,
      collateralToken: FLTToken,
      status,
    };
  }

  // @notice [Figma] List of Proofs.
  // @notice [Figma] Capacity Commitment. Proofs. Submitted Proofs / fails. use both filters:
  //  capacityCommitmentStatsPerEpochId, computeUnitId
  async getProofs(
    filters?: ProofsFilters,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: ProofsOrderBy = "createdAt",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
  ): Promise<ProofBasicListView> {
    await this._init();

    const filtersSerialized = serializeProofsFiltersToIndexer(filters);
    const data = await this._indexerClient.getSubmittedProofs({
      filters: filtersSerialized,
      offset,
      limit,
      orderType,
      orderBy: serializeProofsOrderByToIndexer(orderBy),
    });
    const res: Array<ProofBasic> = data.submittedProofs.map((proof) => {
      return {
        transactionId: proof.id,
        capacityCommitmentId: proof.capacityCommitment.id,
        computeUnitId: proof.computeUnit.id,
        peerId: proof.peer.id,
        createdAt: Number(proof.createdAt),
        providerId: proof.peer.provider.id,
        createdAtEpoch: Number(proof.createdEpoch),
      };
    });

    // TODO: generalize code below.
    let total = null;
    if (
      data.graphNetworks.length == 1 &&
      data.graphNetworks[0] &&
      data.graphNetworks[0].proofsTotal
    ) {
      total = data.graphNetworks[0].proofsTotal as string;
    }
    return {
      data: res,
      total,
    };
  }

  // @notice [Figma] Capacity Commitment. List of compute units.
  // @dev It does 2 requests: for CC and for CUs.
  async getComputeUnitsByCapacityCommitment(
    capacityCommitmentId: string,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: ComputeUnitsOrderBy = "createdAt",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
  ): Promise<ComputeUnitsWithCCStatusListView> {
    await this._init();

    const capacityCommitment =
      await this.getCapacityCommitment(capacityCommitmentId);
    if (!capacityCommitment) {
      throw new Error(
        `Capacity commitment with id ${capacityCommitmentId} not found.`,
      );
    }

    // To get data of CUs by capacity commitment we filter CUs by peer id of the CC.
    const data = await this._indexerClient.getComputeUnits({
      filters: {
        peer_: { id: capacityCommitment.peerId },
      },
      offset,
      limit,
      orderBy,
      orderType,
    });

    return {
      total: null,
      data: serializeComputeUnitsWithStatus(data.computeUnits),
    };
  }

  // @notice [Figma] Peer Id. List of compute units (currently not in Figma).
  async getComputeUnitsByPeer(
    peerId: string,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: ComputeUnitsOrderBy = "createdAt",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
  ): Promise<ComputeUnitsWithCCStatusListView> {
    await this._init();

    // To get data of CUs by capacity commitment we filter CUs by peer id of the CC.
    const data = await this._indexerClient.getComputeUnits({
      filters: {
        peer_: { id: peerId },
      },
      offset,
      limit,
      orderBy,
      orderType,
    });

    return {
      total: null,
      data: serializeComputeUnitsWithStatus(data.computeUnits),
    };
  }

  // @notice [Figma] Capacity Commitment. Proofs.
  async getProofsByCapacityCommitment(
    capacityCommitmentId: string,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: ProofStatsByCapacityCommitmentOrderBy = "epoch",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
  ): Promise<ProofStatsByCapacityCommitmentListView> {
    await this._init();

    const capacityCommitment =
      await this.getCapacityCommitment(capacityCommitmentId);
    if (!capacityCommitment) {
      throw new Error(
        `Capacity commitment with id ${capacityCommitmentId} not found.`,
      );
    }

    const data = await this._indexerClient.getCapacityCommitmentStatsPerEpochs({
      filters: {
        capacityCommitment_: { id: capacityCommitmentId },
      },
      offset,
      limit,
      orderBy,
      orderType,
    });

    // TODO: generate table with missed epoches as well (there might be filtration by epoches,
    //  thus, logic could be complicated, resolve after discussion with PM.
    let res: Array<ProofStatsByCapacityCommitment> = [];
    for (const proofStats of data.capacityCommitmentStatsPerEpochs) {
      res.push({
        createdAtEpoch: Number(proofStats.epoch),
        createdAtEpochBlockNumberStart: Number(proofStats.blockNumberStart),
        createdAtEpochBlockNumberEnd: Number(proofStats.blockNumberEnd),
        computeUnitsExpected: proofStats.activeUnitCount,
        submittedProofs: proofStats.submittedProofsCount,
        computeUnitsFailed:
          proofStats.activeUnitCount -
          proofStats.computeUnitsWithMinRequiredProofsSubmittedCounter,
        computeUnitsSuccess:
          proofStats.computeUnitsWithMinRequiredProofsSubmittedCounter,
        submittedProofsPerCU:
          proofStats.submittedProofsCount / proofStats.activeUnitCount,
      });
    }

    return {
      total: null,
      data: res,
    };
  }

  // @notice [Figma] При клике на карточку эпохи появится окно с перечнем всех CU внутри этого CC.
  // @dev It does 2 queries: for CC and for CUs stats. TODO: reduce to 1 query.
  // TODO: move data manipulation to serializer.
  async getComputeUnitStatsPerCapacityCommitmentEpoch(
    capacityCommitmentId: string,
    epoch: number,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: ComputeUnitStatsPerCapacityCommitmentEpochOrderBy = "id",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
  ): Promise<ComputeUnitStatsPerCapacityCommitmentEpochListView> {
    await this._init();
    // Get all CU linked to CC.
    const capacityCommitmentFetched =
      await this._indexerClient.getCapacityCommitment({
        id: capacityCommitmentId,
      });
    if (!capacityCommitmentFetched.capacityCommitment) {
      throw new Error(
        `Capacity commitment with id ${capacityCommitmentId} not found.`,
      );
    }

    // Get stats for all Compute Units of the CC for the epoch.
    const computeUnitPerEpochStatsFetched =
      await this._indexerClient.getComputeUnitPerEpochStats({
        filters: {
          capacityCommitment_: { id: capacityCommitmentId },
          epoch: epoch.toString(),
        },
        offset,
        limit,
        orderBy,
        orderType,
      });

    // Extract desirable stats for compute unit if stats have been stored for the CUs.
    // Also extract info if CU in Deal.
    let computeUnitToSubmittedProofsPerEpoch: Record<string, number> = {};
    computeUnitPerEpochStatsFetched.computeUnitPerEpochStats.map((stats) => {
      computeUnitToSubmittedProofsPerEpoch[stats.computeUnit.id] =
        stats.submittedProofsCount;
    });
    let allCUsOfCC: Array<string> = [];
    let computeUnitsInDeal = new Set();
    const capacityCommitmentComputeUnits =
      capacityCommitmentFetched.capacityCommitment.computeUnits ?? [];
    for (const capacityCommitmentToComputeUnit of capacityCommitmentComputeUnits) {
      const _computeUnit = capacityCommitmentToComputeUnit.computeUnit;
      allCUsOfCC.push(_computeUnit.id);
      if (_computeUnit.deal && _computeUnit.deal.id) {
        computeUnitsInDeal.add(_computeUnit.id);
      }
    }

    // Merge queries to serialize data.
    let res: Array<ComputeUnitStatsPerCapacityCommitmentEpoch> = [];
    for (const computeUnitId of allCUsOfCC) {
      let submittedProofs = 0;
      if (computeUnitId in computeUnitToSubmittedProofsPerEpoch) {
        submittedProofs = Number(
          computeUnitToSubmittedProofsPerEpoch[computeUnitId],
        );
      }
      let computeUnitProofStatus: "failed" | "success" = "failed";
      if (submittedProofs >= this._capacityMinRequiredProofsPerEpoch!) {
        computeUnitProofStatus = "success";
      } else if (computeUnitId in computeUnitsInDeal) {
        // Compute unit is not failed if it is not in deal right now.
        computeUnitProofStatus = "success";
      } else {
        computeUnitProofStatus = "failed";
      }

      res.push({
        capacityCommitmentId: capacityCommitmentId,
        computeUnitId: computeUnitId,
        submittedProofs,
        computeUnitProofStatus,
      });
    }

    return {
      total: null,
      data: res,
    };
  }
}

/*
 * @deprecated: rename to DealExplorerClient
 */
export class DealIndexerClient extends DealExplorerClient {}
