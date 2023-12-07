import { GraphQLClient } from "graphql-request";
import {
    DealQueryQueryVariables,
    DealsQueryQueryVariables,
    getSdk as getDealsSdk,
    Sdk as DealsSdk
} from "./queries/deals-query.generated";
import {
    getSdk as getOffersSdk,
    OfferQueryQueryVariables,
    OffersQueryQueryVariables,
    Sdk as OffersSdk
} from "./queries/offers-query.generated";
import {
    getSdk as getProvidersSdk, ProviderQueryQueryVariables,
    ProvidersQueryQueryVariables,
    Sdk as ProvidersSdk
} from "./queries/providers-query.generated";

export class IndexerClient {
    public dealsClient: DealsSdk;
    public offersClient: OffersSdk;
    public providersClient: ProvidersSdk;
    constructor(url: string) {
        const client = new GraphQLClient(url);
        this.dealsClient = getDealsSdk(client);
        this.offersClient = getOffersSdk(client);
        this.providersClient = getProvidersSdk(client);
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
}
