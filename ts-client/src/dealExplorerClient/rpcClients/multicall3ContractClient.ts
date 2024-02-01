import type { Interface, Result, ethers } from "ethers";
import { IMulticall3__factory, type IMulticall3 } from "../../index.js";

export type Multicall3ContractCall = {
  target: string;
  allowFailure: boolean;
  callData: string;
};
export type Aggregate3Response = { success: boolean; returnData: string };
export type TxResultsConverter = (result: Result | null, ...opt: any[]) => any;

/*
 * @description Client to be inherited from to work with Multicall3 contract to perform batch calls.
 * @dev For more info: https://github.com/mds1/multicall/tree/main.
 */
export abstract class Multicall3ContractClient {
  _caller: ethers.Provider | ethers.Signer;
  _multicall3Contract: IMulticall3;
  constructor(
    caller: ethers.Provider | ethers.Signer,
    multicall3ContractAddress: string,
  ) {
    this._caller = caller;
    this._multicall3Contract = IMulticall3__factory.connect(
      multicall3ContractAddress,
      this._caller,
    );
  }

  /*
   * @dev Put arrays of encoded calls and other data to decode and convert responses:
    *dev - callResultsInterfaces
    *dev - contractMethods
    *dev - txResultsConverters
   * @dev Note, If one of the transaction is reverted it sends null to txResultsConverter.
   * @dev  Thus, null should be caught appropriate in a supplied txResultsConverter.
   */
  async _callBatch(
    callsEncoded: Multicall3ContractCall[],
    callResultsInterfaces: Array<Interface>,
    contractMethods: Array<string>,
    txResultsConverters: Array<TxResultsConverter>,
  ): Promise<Array<any>> {
    console.group("[_callBatch]");
    console.info(
      "Send batch request with callsEncoded = %s...",
      JSON.stringify(callsEncoded),
    );
    const multicallContractCallResults: Aggregate3Response[] =
      await this._multicall3Contract.aggregate3.staticCall(callsEncoded);
    console.debug("Got: %s", JSON.stringify(multicallContractCallResults));

    let decodedResults: Array<any> = [];
    for (let i = 0; i < multicallContractCallResults.length; i++) {
      const txResultsConverter = txResultsConverters[i]
      const contractMethod = contractMethods[i]
      const callResultsInterface = callResultsInterfaces[i]
      if (txResultsConverter == undefined || contractMethod == undefined || callResultsInterface == undefined) {
        throw new Error("Assertion: txResultsConverter or contractMethod or callResultsInterface is undefined.")
      }

      const rawResult = multicallContractCallResults[i];
      if (rawResult == undefined || !rawResult.success) {
        decodedResults.push(txResultsConverter(null));
        continue;
      }

      const rawReturnData = rawResult.returnData;
      console.debug("Raw data: %s", rawReturnData);

      const decoded = callResultsInterface.decodeFunctionResult(
        contractMethod,
        rawReturnData,
      );
      console.debug("Got after decoding: %s", decoded);
      console.info("Apply converter: %s", txResultsConverter.name);
      decodedResults.push(txResultsConverter(decoded));
    }
    console.groupEnd();
    return decodedResults;
  }

  // Basic implementation of TxResultsConverter.
  _decodeToString(result: Result | null, defaultNoResult: string = ""): string {
    if (!result) {
      return defaultNoResult;
    }
    return result.toString();
  }
}
