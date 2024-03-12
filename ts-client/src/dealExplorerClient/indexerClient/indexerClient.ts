import type {
  DealQueryQueryVariables,
  DealsQueryQueryVariables,
  DealsByPeerQueryQueryVariables,
  Sdk as DealsSdk,
} from "./queries/deals-query.generated.js";
import { getSdk as getDealsSdk } from "./queries/deals-query.generated.js";
import type {
  ComputeUnitQueryQueryVariables,
  ComputeUnitsQueryQueryVariables,
  Sdk as PeersSdk,
} from "./queries/peers-query.generated.js";
import { getSdk as getPeersSdk } from "./queries/peers-query.generated.js";
import type {
  EffectorQueryQueryVariables,
  OfferQueryQueryVariables,
  OffersQueryQueryVariables,
  Sdk as OffersSdk,
  TokenQueryQueryVariables,
} from "./queries/offers-query.generated.js";
import { getSdk as getOffersSdk } from "./queries/offers-query.generated.js";
import type {
  ProviderQueryQueryVariables,
  ProvidersQueryQueryVariables,
  Sdk as ProvidersSdk,
} from "./queries/providers-query.generated.js";
import { getSdk as getProvidersSdk } from "./queries/providers-query.generated.js";
import type {
  CapacityCommitmentQueryQueryVariables,
  CapacityCommitmentStatsPerEpochQueryQueryVariables,
  ComputeUnitPerEpochStatsQueryQueryVariables,
  Sdk as CapacityCommitmentsSdk,
  SubmittedProofsQueryQueryVariables,
} from "./queries/capacity-commitments-query.generated.js";
import type { Sdk as ContractConstantsSdk } from "./queries/constants-query.generated.js";
import { getSdk as getContractConstantsSdk } from "./queries/constants-query.generated.js";
import { getSdk as getCapacityCommitmentsSdk } from "./queries/capacity-commitments-query.generated.js";
import { IndexerClientABC } from "../../indexerClientABC/indexerClientABC.js";
import type { ContractsENV } from "../../client/config.js";
import type { CapacityCommitmentsQueryQueryVariables } from "./queries/capacity-commitments-query.generated.js";
import type { PeerQueryQueryVariables } from "./queries/peers-query.generated.js";

export class IndexerClient extends IndexerClientABC {
  private dealsClient: DealsSdk;
  private offersClient: OffersSdk;
  private providersClient: ProvidersSdk;
  private capacityCommitmentsClient: CapacityCommitmentsSdk;
  private contractConstantsClient: ContractConstantsSdk;
  private peersClient: PeersSdk;
  constructor(network: ContractsENV) {
    super(network);
    this.dealsClient = getDealsSdk(this._graphqlClient);
    this.offersClient = getOffersSdk(this._graphqlClient);
    this.capacityCommitmentsClient = getCapacityCommitmentsSdk(
      this._graphqlClient,
    );
    this.peersClient = getPeersSdk(this._graphqlClient);
    this.providersClient = getProvidersSdk(this._graphqlClient);
    this.contractConstantsClient = getContractConstantsSdk(this._graphqlClient);
  }

  async getProviders(variables: ProvidersQueryQueryVariables) {
    return await this.providersClient.ProvidersQuery(variables);
  }

  async getProvider(variables: ProviderQueryQueryVariables) {
    return await this.providersClient.ProviderQuery(variables);
  }

  async getOffers(variables: OffersQueryQueryVariables) {
    return await this.offersClient.OffersQuery(variables);
  }

  async getOffer(variables: OfferQueryQueryVariables) {
    return await this.offersClient.OfferQuery(variables);
  }

  async getDeals(variables: DealsQueryQueryVariables) {
    return await this.dealsClient.DealsQuery(variables);
  }

  async getDeal(variables: DealQueryQueryVariables) {
    return await this.dealsClient.DealQuery(variables);
  }

  async getEffectors(variables: EffectorQueryQueryVariables) {
    return await this.offersClient.EffectorQuery(variables);
  }

  async getTokens(variables: TokenQueryQueryVariables) {
    return await this.offersClient.TokenQuery(variables);
  }

  async getCapacityCommitments(
    variables: CapacityCommitmentsQueryQueryVariables,
  ) {
    return await this.capacityCommitmentsClient.CapacityCommitmentsQuery(
      variables,
    );
  }

  async getCapacityCommitment(
    variables: CapacityCommitmentQueryQueryVariables,
  ) {
    return await this.capacityCommitmentsClient.CapacityCommitmentQuery(
      variables,
    );
  }

  async getContractConstants() {
    return await this.contractConstantsClient.ConstantsQuery();
  }

  async getPeer(variables: PeerQueryQueryVariables) {
    return await this.peersClient.PeerQuery(variables);
  }

  // Get all deals per provided id of a Peer.
  async getPeerDeals(variables: DealsByPeerQueryQueryVariables) {
    return await this.dealsClient.DealsByPeerQuery(variables);
  }

  async getComputeUnit(variables: ComputeUnitQueryQueryVariables) {
    return await this.peersClient.ComputeUnitQuery(variables);
  }

  async getSubmittedProofs(variables: SubmittedProofsQueryQueryVariables) {
    return await this.capacityCommitmentsClient.SubmittedProofsQuery(variables);
  }

  async getComputeUnits(variables: ComputeUnitsQueryQueryVariables) {
    return await this.peersClient.ComputeUnitsQuery(variables);
  }

  async getCapacityCommitmentStatsPerEpoches(
    variables: CapacityCommitmentStatsPerEpochQueryQueryVariables,
  ) {
    return await this.capacityCommitmentsClient.CapacityCommitmentStatsPerEpochQuery(
      variables,
    );
  }

  async getComputeUnitPerEpochStats(
    variables: ComputeUnitPerEpochStatsQueryQueryVariables,
  ) {
    return await this.capacityCommitmentsClient.ComputeUnitPerEpochStatsQuery(
      variables,
    );
  }
}
