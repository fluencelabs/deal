import type { Interface, Result, ethers } from "ethers";
import { IMulticall3__factory, type IMulticall3 } from "../../index.js";

export type Multicall3ContractCall = { target: string, allowFailure: boolean, callData: string };
export type Aggregate3Response = { success: boolean; returnData: string };
export type TxResultsConverter<T> = (result: Result, ...opt: any[]) => T;

/*
 * @description Client to be inherited from to work with Multicall3 contract to perform batch calls.
 * @dev For more info: https://github.com/mds1/multicall/tree/main.
*/
export abstract class Multicall3ContractClient {
    _caller: ethers.Provider | ethers.Signer;
    _multicall3Contract: IMulticall3;
    constructor(caller: ethers.Provider | ethers.Signer, multicall3ContractAddress: string) {
        this._caller = caller
        this._multicall3Contract = IMulticall3__factory.connect(multicall3ContractAddress, this._caller);
    }

    async _callBatch<ConvertTo>(
        callsEncoded: Multicall3ContractCall[],
        callResultsInterface: Interface,
        contractMethod: string,
        txResultsConverter: TxResultsConverter<ConvertTo>,
    ): Promise<Array<ConvertTo>> {
        console.group("[_callBatch]");
        console.info('Send batch request with callsEncoded = %s...', JSON.stringify(callsEncoded))
        const multicallContractCallResults: Aggregate3Response[] = await this._multicall3Contract.aggregate3.staticCall(callsEncoded);
        let decodedResults: Array<ConvertTo> = []
        console.info("Decode and convert all results with converter %s", txResultsConverter.name)
        for (const rawResult of multicallContractCallResults) {
            console.info('Success status: %s', rawResult.success)
            console.debug('Raw data: %s', rawResult.returnData)

            const decoded = callResultsInterface.decodeFunctionResult(contractMethod, rawResult.returnData)
            // const dealContractForInterface = await this._dealContracts.getFLT()
            // const decoder = dealContractForInterface.interface
            // const decoded = decoder.decodeFunctionResult('name', rawResult.returnData)

            console.debug('Got after decoding: %s', decoded)
            decodedResults.push(
                txResultsConverter(decoded)
            )
        }
        console.groupEnd();
        return decodedResults
    }

    _decodeToString(result: Result, defaultNoResult: string = ""): string {
        if (!result) {
            return defaultNoResult;
        }
        return result.toString();
    }
}