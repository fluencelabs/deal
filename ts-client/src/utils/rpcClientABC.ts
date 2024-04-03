import type { Interface, Result, ethers } from "ethers";
import { Multicall3__factory, type Multicall3 } from "../index.js";
import { getLogger } from "./logger.js";

const logger = getLogger("deal-ts-clients:rpcClientABC");

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
export abstract class Multicall3ContractClientABC {
  _caller: ethers.Provider | ethers.Signer;
  _multicall3Contract: Multicall3;
  constructor(
    caller: ethers.Provider | ethers.Signer,
    multicall3ContractAddress: string,
  ) {
    this._caller = caller;
    this._multicall3Contract = Multicall3__factory.connect(
      multicall3ContractAddress,
      this._caller,
    );
  }

  /*
   * @dev Put arrays of encoded calls and other data to decode and convert responses:
   * @dev - callResultsInterfaces
   * @dev - contractMethods
   * @dev - txResultsConverters
   * @dev Note, If one of the transaction is reverted it sends null to txResultsConverter.
   * @dev  Thus, null should be caught appropriate in a supplied txResultsConverter.
   */
  async _callBatch(
    callsEncoded: Multicall3ContractCall[],
    callResultsInterfaces: Array<Interface>,
    contractMethods: Array<string>,
    txResultsConverters: Array<TxResultsConverter>,
  ): Promise<Array<any>> {
    if (
      (callsEncoded.length +
        callResultsInterfaces.length +
        contractMethods.length +
        txResultsConverters.length) %
        4 !=
      0
    ) {
      throw new Error(
        "Assertion: callsEncoded, callResultsInterfaces, contractMethods, txResultsConverters should have the same length.",
      );
    }
    logger.info(
      `[_callBatch] Send batch request with callsEncoded = ${JSON.stringify(callsEncoded)}...`,
    );
    const multicallContractCallResults: Aggregate3Response[] =
      await this._multicall3Contract.aggregate3.staticCall(callsEncoded);
    logger.debug(
      `[_callBatch] Got: ${JSON.stringify(multicallContractCallResults)}`,
    );

    let decodedResults: Array<any> = [];
    for (let i = 0; i < multicallContractCallResults.length; i++) {
      const txResultsConverter = txResultsConverters[i];
      const contractMethod = contractMethods[i];
      const callResultsInterface = callResultsInterfaces[i];
      if (
        txResultsConverter == undefined ||
        contractMethod == undefined ||
        callResultsInterface == undefined
      ) {
        throw new Error(
          "Assertion: txResultsConverter or contractMethod or callResultsInterface is undefined.",
        );
      }

      const rawResult = multicallContractCallResults[i];
      if (rawResult == undefined || !rawResult.success) {
        decodedResults.push(txResultsConverter(null));
        continue;
      }

      const rawReturnData = rawResult.returnData;
      logger.debug(`[_callBatch] Raw data: ${rawReturnData}`);

      const decoded = callResultsInterface.decodeFunctionResult(
        contractMethod,
        rawReturnData,
      );
      logger.debug(`[_callBatch] Got after decoding: ${decoded}`);
      logger.info(`[_callBatch] Apply converter: ${txResultsConverter.name}`);
      decodedResults.push(txResultsConverter(decoded));
    }
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
