import type { Result, ethers } from "ethers";
import {
  Multicall3ContractClient,
  type Multicall3ContractCall,
} from "./multicall3ContractClient.js";
import {Capacity__factory, Deal__factory} from "../../index.js";
import {
  serializeTxCapacityCommitmentStatus,
  serializeTxDealStatus
} from "./serializers.js";

export class DealRpcClient extends Multicall3ContractClient {
  constructor(
    caller: ethers.Provider | ethers.Signer,
    multicall3ContractAddress: string,
  ) {
    super(caller, multicall3ContractAddress);
  }

  // Get statuses for batch of Deals by 1 call.
  async getStatusDealBatch(dealAddresses: Array<string>) {
    if (dealAddresses[0] == undefined) {
      return [];
    }

    // We need any of the deal contract coz we will use interface of the Deal only.
    const dealContractForInterface = Deal__factory.connect(
      dealAddresses[0],
      this._caller,
    );
    const contractMethod = "getStatus";
    const callEncoded =
      dealContractForInterface.interface.encodeFunctionData(contractMethod);
    const callsEncoded: Multicall3ContractCall[] = dealAddresses.map(
      (dealAddress) => ({
        target: dealAddress,
        allowFailure: true, // We allow failure for all calls.
        callData: callEncoded,
      }),
    );

    return await this._callBatch(
      callsEncoded,
      dealContractForInterface.interface,
      contractMethod,
      serializeTxDealStatus,
    );
  }

  _txToBigInt(result: Result | null): bigint | null {
    if (!result) {
      return null;
    }
    return BigInt(result.toString());
  }

  async getFreeBalanceDealBatch(dealAddresses: Array<string>) {
    if (dealAddresses[0] == undefined) {
      return [];
    }

    const dealContractForInterface = Deal__factory.connect(
      dealAddresses[0],
      this._caller,
    );
    const contractMethod = "getFreeBalance";
    const callEncoded =
      dealContractForInterface.interface.encodeFunctionData(contractMethod);
    const callsEncoded: Multicall3ContractCall[] = dealAddresses.map(
      (dealAddress) => ({
        target: dealAddress,
        allowFailure: true, // We allow failure for all calls.
        callData: callEncoded,
      }),
    );

    return await this._callBatch(
      callsEncoded,
      dealContractForInterface.interface,
      contractMethod,
      this._txToBigInt,
    );
  }

  // Get statuses for batch of Capacity Commitments by 1 call.
  async getStatusCapacityCommitmentsBatch(capacityContractAddress: string, capacityCommitmentIds: Array<string>) {
    // We need any of the deal contract coz we will use interface of the Deal only.
    const contractInstance = Capacity__factory.connect(
      capacityContractAddress,
      this._caller,
    );
    const contractMethod = "getStatus";
    const callsEncoded: Multicall3ContractCall[] = [];
    for (let i = 0; i < capacityCommitmentIds.length; i++) {
      callsEncoded.push(
        {
          target: capacityContractAddress,
          allowFailure: true, // We allow failure for all calls.
          // @ts-ignore
          callData: contractInstance.interface.encodeFunctionData(contractMethod, [capacityCommitmentIds[i]]),
        }
      )
    }

    return await this._callBatch(
      callsEncoded,
      contractInstance.interface,
      contractMethod,
      serializeTxCapacityCommitmentStatus,
    );
  }
}
