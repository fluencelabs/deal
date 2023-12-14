import type { Result, ethers } from "ethers";
import { Multicall3ContractClient, type Multicall3ContractCall } from "./multicall3ContractClient.js";
import { Deal__factory } from "../../index.js";
import type { DealStatus } from "../types.js";


export class DealRpcClient extends Multicall3ContractClient {
    constructor(caller: ethers.Provider | ethers.Signer, multicall3ContractAddress: string) {
        super(caller, multicall3ContractAddress);
    }

    _txDealStatusToString(result: Result | null): DealStatus {
        // Values are:
        // ENDED
        // INACTIVE
        // ACTIVE and undefined
        if (!result) {
            return 'undefined'
        }
        let status: DealStatus;
        const converted = Number(result)
        switch (converted) {
            case 0: {
                status = 'inactive'
                break;
            }
            case 1: {
                status = 'active'
                break;
            }
            case 2: {
                status = 'ended'
                break;
            }
            default: {
                status = 'undefined'
                break;
            }
        }
        return status;
    }

    // TODO: createMarket with deals.
    // Get statuses for batch of Deals by 1 call.
    // Status depends on maxPaidEpoch to subgraph.
    async getStatusDealBatch(dealAddresses: Array<string>) {
        if (!dealAddresses || dealAddresses[0] == undefined) {
            return []
        }

        // We need any of the deal contract coz we will use interface of the Deal only.
        const dealContractForInterface = Deal__factory.connect(dealAddresses[0], this._caller)
        const contractMethod = 'getStatus'
        const callEncoded = dealContractForInterface.interface.encodeFunctionData(contractMethod)
        const callsEncoded: Multicall3ContractCall[] = dealAddresses.map((dealAddress) => ({
            target: dealAddress,
            allowFailure: true, // We allow failure for all calls.
            callData: callEncoded,
        }));

        return await this._callBatch(
            callsEncoded,
            dealContractForInterface.interface,
            contractMethod,
            this._txDealStatusToString,
        )
    }

    //   TODO: Provider earnings: (depositedSum - withdravalSum [withdraw()]) - freeBalance()
}