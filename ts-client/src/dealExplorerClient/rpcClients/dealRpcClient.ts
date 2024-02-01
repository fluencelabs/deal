import type { ethers } from "ethers";
import {
  Multicall3ContractClient,
  type Multicall3ContractCall,
} from "./multicall3ContractClient.js";
import { Capacity__factory, Deal__factory } from "../../index.js";
import {
  serializeTxCapacityCommitmentStatus,
  serializeTxDealStatus,
  serializeTxToBigInt,
} from "./serializers.js";
import type { CapacityCommitmentStatus } from "../types/schemes.js";

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
    const contractInstance = Deal__factory.connect(
      dealAddresses[0],
      this._caller,
    );
    const contractMethod = "getStatus";
    const callEncoded =
      contractInstance.interface.encodeFunctionData(contractMethod);
    const callsEncoded: Multicall3ContractCall[] = [];
    const callResultsInterfaces = [];
    const contractMethods = [];
    const txResultsConverters = [];
    for (let i = 0; i < dealAddresses.length; i++) {
      const dealAddress = dealAddresses[i];
      if (!dealAddress) {
        throw new Error("Assertion: dealAddress is undefined.");
      }
      callsEncoded.push({
        target: dealAddress,
        allowFailure: true, // We allow failure for all calls.
        callData: callEncoded,
      });
      callResultsInterfaces.push(contractInstance.interface);
      contractMethods.push(contractMethod);
      txResultsConverters.push(serializeTxDealStatus);
    }

    return await this._callBatch(
      callsEncoded,
      callResultsInterfaces,
      contractMethods,
      txResultsConverters,
    );
  }

  async getFreeBalanceDealBatch(dealAddresses: Array<string>) {
    if (dealAddresses[0] == undefined) {
      return [];
    }

    const contractInstance = Deal__factory.connect(
      dealAddresses[0],
      this._caller,
    );
    const contractMethod = "getFreeBalance";
    const callEncoded =
      contractInstance.interface.encodeFunctionData(contractMethod);

    const callsEncoded: Multicall3ContractCall[] = [];
    const callResultsInterfaces = [];
    const contractMethods = [];
    const txResultsConverters = [];
    for (let i = 0; i < dealAddresses.length; i++) {
      const dealAddress = dealAddresses[i];
      if (!dealAddress) {
        throw new Error("Assertion: dealAddress is undefined.");
      }
      callsEncoded.push({
        target: dealAddress,
        allowFailure: true, // We allow failure for all calls.
        callData: callEncoded,
      });
      callResultsInterfaces.push(contractInstance.interface);
      contractMethods.push(contractMethod);
      txResultsConverters.push(serializeTxToBigInt);
    }

    // TODO: add exact validation instead of "as".
    return (await this._callBatch(
      callsEncoded,
      callResultsInterfaces,
      contractMethods,
      txResultsConverters,
    )) as Array<bigint | null>;
  }

  // Get statuses for batch of Capacity Commitments by 1 call.
  async getStatusCapacityCommitmentsBatch(
    capacityContractAddress: string,
    capacityCommitmentIds: Array<string>,
  ) {
    // We need any of the deal contract coz we will use interface of the Deal only.
    const contractInstance = Capacity__factory.connect(
      capacityContractAddress,
      this._caller,
    );
    const contractMethod = "getStatus";
    const callsEncoded: Multicall3ContractCall[] = [];
    const callResultsInterfaces = [];
    const contractMethods = [];
    const txResultsConverters = [];
    for (let i = 0; i < capacityCommitmentIds.length; i++) {
      callsEncoded.push({
        target: capacityContractAddress,
        allowFailure: true, // We allow failure for all calls.
        // @ts-ignore
        callData: contractInstance.interface.encodeFunctionData(
          contractMethod,
          [capacityCommitmentIds[i]],
        ),
      });
      callResultsInterfaces.push(contractInstance.interface);
      contractMethods.push(contractMethod);
      txResultsConverters.push(serializeTxCapacityCommitmentStatus);
    }

    // TODO: add exact validation instead of "as".
    return (await this._callBatch(
      callsEncoded,
      callResultsInterfaces,
      contractMethods,
      txResultsConverters,
    )) as Array<CapacityCommitmentStatus>;
  }

  // Fetch on-chain data through several view methods of Capacity contract for the exact CC.
  // It gets:
  // - status
  // - unlockedRewards
  // - totalRewards
  async getCapacityCommitmentDetails(
    capacityContractAddress: string,
    capacityCommitmentId: string,
  ) {
    const contractInstance = Capacity__factory.connect(
      capacityContractAddress,
      this._caller,
    );

    const contractMethods = ["getStatus", "unlockedRewards", "totalRewards"];
    const txResultsConverters = [
      serializeTxCapacityCommitmentStatus,
      serializeTxToBigInt,
      serializeTxToBigInt,
    ];
    const callsEncoded: Multicall3ContractCall[] = [
      {
        target: capacityContractAddress,
        allowFailure: true, // We allow failure for all calls.
        callData: contractInstance.interface.encodeFunctionData("getStatus", [
          capacityCommitmentId,
        ]),
      },
      {
        target: capacityContractAddress,
        allowFailure: true, // We allow failure for all calls.
        callData: contractInstance.interface.encodeFunctionData(
          "unlockedRewards",
          [capacityCommitmentId],
        ),
      },
      {
        target: capacityContractAddress,
        allowFailure: true, // We allow failure for all calls.
        callData: contractInstance.interface.encodeFunctionData(
          "totalRewards",
          [capacityCommitmentId],
        ),
      },
    ];
    const callResultsInterfaces = [
      contractInstance.interface,
      contractInstance.interface,
      contractInstance.interface,
    ];

    const results = await this._callBatch(
      callsEncoded,
      callResultsInterfaces,
      contractMethods,
      txResultsConverters,
    );
    if (results.length != 3) {
      throw new Error(
        "[getCapacityCommitmentDetails] Assertion: results.length != 3",
      );
    }
    return {
      status: results[0] as CapacityCommitmentStatus,
      unlockedRewards: results[1] as bigint | null,
      totalRewards: results[2] as bigint | null,
    };
  }
}
