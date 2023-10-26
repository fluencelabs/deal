import {ethers} from "ethers";

// TODO: refactor a bit to support recommendation:
//  https://docs.ethers.org/v5/api/providers/provider/#Provider-getFeeData.
export async function getEIP1559Args(provider: ethers.Provider) {
    // If network support EIP1559 it returns: maxFeePerGas, ...
    const feeData = await provider.getFeeData()

    const maxFeePerGas = feeData.maxFeePerGas
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas
    const type = 2  // tx type.

    return {
        maxFeePerGas,
        maxPriorityFeePerGas,
        type,
    }
}
