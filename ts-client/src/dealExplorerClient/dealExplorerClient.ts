import { ethers } from "ethers";
import type {
  DealShort,
  OfferDetail,
  Effector,
  ProviderDetail,
  DealDetail,
  Peer,
  ComputeUnit,
  DealStatus,
  DealShortListView,
  OfferShortListView,
  ProviderShortListView,
  PaymentToken,
  PaymentTokenListView,
  EffectorListView,
  CapacityCommitmentListView,
  CapacityCommitment,
} from "./types/schemes.js";
import type {
  ByProviderAndStatusFilter,
  DealsFilters,
  OffersFilters,
  OfferShortOrderBy,
  ProvidersFilters,
  OrderType,
  ProviderShortOrderBy,
  DealsShortOrderBy,
  EffectorsOrderBy,
  PaymentTokenOrderBy, CapacityCommitmentsFilters, CapacityCommitmentsOrderBy
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
  calculateTimestamp,
  DEFAULT_ORDER_TYPE,
  DEFAULT_TOKEN_VALUE_ROUNDING, FILTER_MULTISELECT_MAX,
  tokenValueToRounded,
} from "./utils.js";
import {
  serializeEffectorDescription,
} from "./serializers/logics.js";
import {serializeDealProviderAccessLists} from "../utils/serializers.js";
import {
  convertDealsFiltersToIndexerType,
  convertOffersFiltersToIndexerType,
  FiltersError,
  serializeCapacityCommitmentsFiltersToIndexer,
  serializeProviderFiltersToIndexer, ValidTogetherFiltersError
} from "./serializers/filters.js";
import {
  composeEffectors,
  composeOfferShort,
  composeProviderBase,
  composeProviderShort
} from "./serializers/schemes.js";
import {
  convertDealShortOrderByToIndexerType,
  convertOfferShortOrderByToIndexerType,
  serializeCapacityCommitmentsOrderByToIndexerType
} from "./serializers/orderby.js";

/*
 * @dev Currently this client depends on contract artifacts and on subgraph artifacts.
 * @dev It supports mainnet, testnet by selecting related contractsEnv.
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
    // Fields to init declare below.
    this._dealRpcClient = null;
    this._coreEpochDuration = null;
    this._coreInitTimestamp = null;
  }

  // Add init other async attributes here.
  // Call before code in every external methods.
  // Currently, it inits:
  // - DealRpcClient multicall3Contract
  // - fetches core constants from indexer.
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
    // Init constants from indexer.
    // TODO: add cache.
    if ((this._coreEpochDuration == null) || (this._coreInitTimestamp == null)) {
      console.info('Fetch contract constants from indexer.')
      const data = await this._indexerClient.getContractConstants()
      if (data.graphNetworks.length != 1 || data.graphNetworks[0] == undefined) {
        throw new Error("Assertion: data.graphNetworks.length != 1 || data.graphNetworks[0] == undefined.")
      }
      this._coreInitTimestamp = Number(data.graphNetworks[0].initTimestamp)
      this._coreEpochDuration = Number(data.graphNetworks[0].coreEpochDuration)
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
        res.push(composeProviderShort(provider));
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
      const providerBase = composeProviderBase(providerFetched);
      res = {
        ...providerBase,
        peerCount: providerFetched.peerCount,
      };
    }
    return res;
  }

  async getOffersByProvider(
    // TODO: what this status is about?
    byProviderAndStatusFilter: ByProviderAndStatusFilter,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: OfferShortOrderBy = "createdAt",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
  ): Promise<OfferShortListView> {
    await this._init();
    if (byProviderAndStatusFilter.status) {
      // TODO.
      console.warn("Status filter is not implemented.");
    }
    return await this._getOffersImpl(
      { providerId: byProviderAndStatusFilter.providerId?.toLowerCase() },
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
    orderType: OrderType = DEFAULT_ORDER_TYPE,
  ): Promise<DealShortListView> {
    await this._init();
    if (byProviderAndStatusFilter.status) {
      // TODO.
      console.warn("Status filter is not implemented.");
    }
    return await this._getDealsImpl(
      { providerId: byProviderAndStatusFilter.providerId?.toLowerCase() },
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
      if (
        otherConditions &&
        paymentTokensLowerCase.length > 1
      ) {
        tokenDecimals = await this._getCommonTokenDecimals(
          paymentTokensLowerCase,
        );
      }
    }
    return tokenDecimals
  }

  async _getOffersImpl(
    offerFilters?: OffersFilters,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: OfferShortOrderBy = "createdAt",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
  ): Promise<OfferShortListView> {
    const orderByConverted = convertOfferShortOrderByToIndexerType(orderBy);

    const _cond = (offerFilters?.minPricePerWorkerEpoch || offerFilters?.maxPricePerWorkerEpoch) !== undefined
    const commonTokenDecimals = await this._calculateTokenDecimalsForFilters(
      offerFilters?.paymentTokens,
      _cond,
    )

    const filtersConverted =
      await convertOffersFiltersToIndexerType(offerFilters, commonTokenDecimals);
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
        res.push(composeOfferShort(offer));
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
        ...composeOfferShort(data.offer),
        peers: this._composePeers(data.offer.peers as Array<BasicPeerFragment>),
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

    const orderByConverted = convertDealShortOrderByToIndexerType(orderBy);

    const _cond = (dealsFilters?.minPricePerWorkerEpoch || dealsFilters?.maxPricePerWorkerEpoch) !== undefined
    const commonTokenDecimals = await this._calculateTokenDecimalsForFilters(
      dealsFilters?.paymentTokens,
      _cond,
    )

    const filtersConverted =
      await convertDealsFiltersToIndexerType(dealsFilters, commonTokenDecimals);
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

  // TODO: relocate.
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
        DEFAULT_TOKEN_VALUE_ROUNDING,
        deal.paymentToken.decimals,
      ),
      status: fromRpcForDealShort.dealStatus
        ? fromRpcForDealShort.dealStatus
        : "active",
      totalEarnings: tokenValueToRounded(
        totalEarnings,
        DEFAULT_TOKEN_VALUE_ROUNDING,
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
      const effectors = composeEffectors(deal.effectors);
      const { whitelist, blacklist } = serializeDealProviderAccessLists(
        deal.providersAccessType,
        deal.providersAccessList,
      );
      res = {
        ...this._composeDealsShort(deal, { dealStatus, freeBalance }),
        pricePerWorkerEpoch: tokenValueToRounded(
          deal.pricePerWorkerEpoch,
          DEFAULT_TOKEN_VALUE_ROUNDING,
          deal.paymentToken.decimals,
        ),
        maxWorkersPerProvider: deal.maxWorkersPerProvider,
        computeUnits: this._composeComputeUnits(
          deal.addedComputeUnits as Array<ComputeUnitBasicFragment>,
        ),
        // Serialize data from indexer into lists.
        whitelist,
        blacklist,
        effectors: effectors,
      };
    }
    return res;
  }

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

  async getCapacityCommitments(
    filters?: CapacityCommitmentsFilters,
    offset: number = 0,
    limit: number = this.DEFAULT_PAGE_LIMIT,
    orderBy: CapacityCommitmentsOrderBy = "createdAt",
    orderType: OrderType = DEFAULT_ORDER_TYPE,
  ): Promise<CapacityCommitmentListView> {
    await this._init();
    const orderBySerialized = serializeCapacityCommitmentsOrderByToIndexerType(orderBy);

    let currentEpoch = undefined
    if (filters?.onlyActive) {
      if (this._coreInitTimestamp == null || this._coreEpochDuration == null) {
        throw new Error("Assertion: Class object was not inited correctly.")
      }
      currentEpoch = calculateEpoch(
        Date.now() / 1000,
        this._coreInitTimestamp,
        this._coreEpochDuration,
      ).toString()
    }

    const filtersSerialized =
      serializeCapacityCommitmentsFiltersToIndexer(filters, currentEpoch);
    const data = await this._indexerClient.getCapacityCommitments({
      filters: filtersSerialized,
      offset,
      limit,
      orderBy: orderBySerialized,
      orderType,
    });
    const res: Array<CapacityCommitment> = [];

    if (data) {
      if (data.graphNetworks.length != 1 || data.graphNetworks[0] == undefined) {
        throw new Error("Assertion: data.graphNetworks.length != 1 || data.graphNetworks[0] == undefined.")
      }
      for (const capacityCommitment of data.capacityCommitments) {

        let expiredAt = null
        if (capacityCommitment.endEpoch != 0) {
          expiredAt = calculateTimestamp(
            Number(capacityCommitment.endEpoch),
            Number(data.graphNetworks[0].initTimestamp),
            Number(data.graphNetworks[0].coreEpochDuration)
          )
        }

        res.push({
          id: capacityCommitment.id,
          createdAt: Number(capacityCommitment.createdAt),
          expiredAt,
          providerId: capacityCommitment.peer.provider.id,
          peerId: capacityCommitment.peer.id,
          computeUnitsCount: Number(capacityCommitment.computeUnitsCount),
        });
      }
    }
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
}

/*
 * @deprecated: rename to DealExplorerClient
 */
export class DealIndexerClient extends DealExplorerClient {}
