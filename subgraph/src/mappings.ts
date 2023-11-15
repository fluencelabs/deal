// File should be writen after `npm run compile` is run or you will encounter syntax and import errors.
import { MarketOffer } from "../generated/schema";
import {MarketOfferRegistered, CoreImpl, ComputeUnitCreated} from '../generated/Core/CoreImpl'
// import {extractIdFromEvent} from "./utils";
import { log } from '@graphprotocol/graph-ts'
import {getTokenSymbol} from "./tokenNames";
// log.info('My value is: {}', [myValue])


// TODO: where/what is maxCollateralPerWorker?
export function handleRegisterMarketOffer(event: MarketOfferRegistered): void {
    // Events: MarketOfferRegistered
    // Children events:
    // - emit PeerCreated(offerId, peer.peerId);
    // - emit ComputeUnitCreated(offerId, peerId, unitId);
    // Screen: List of offers

    let entity = new MarketOffer(event.params.offerId.toHex());

    entity.createdAt = event.block.timestamp;
    entity.provider = event.params.owner;
    log.info("2: {}", ['2'])
    entity.pricePerEpoch = event.params.minPricePerWorkerEpoch;
    entity.tokenSymbol = getTokenSymbol(event.params.paymentToken)
    // TODO: how to Handle ComputeUnitCreated events as well via transaction logs instead of contract call.
    //  mb the flow via separate handler is more natural.
    // if (event.receipt !== null) {
    //     event.receipt!.logs.forEach((txLog) => {
    //         log.info('event.receipt.logs {} and type of: {}', [txLog.topics.toString(), txLog.logType]);
    //     })
    // }
    entity.save();
}

export function handleComputeUnitCreated(event: ComputeUnitCreated): void {
    let entity = MarketOffer.load(event.params.offerId.toHex());  // TODO: or create

    if (entity == null) {
        return
    }

    // or maybe save everything into context and then count:
    //  https://thegraph.com/docs/en/developing/creating-a-subgraph/#data-source-context.
    entity.computeUnits += 1

}

// TODO: handle other update queries: addFreeUnits
// Parse current contract data:
//     let contract = CoreImpl.bind(event.address)
//     let erc20Symbol = contract.symbol()

// export function handleComputeUnitCreated(event: ComputeUnitCreated): void {
//     let entity = new MarketOffer(extractIdFromEvent(event));
//
// }

// type MarketOffer @entity {
//   id: ID!
//   createdAt: BigInt!
//   provider: String!
//   computeUnits: Int
//   pricePerEpoch: Int
//   maxCollateralPerWorker: Int
// }
