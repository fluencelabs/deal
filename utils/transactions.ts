import { ethers } from "ethers";

// TODO: refactor a bit to support recommendation:
//  https://docs.ethers.org/v5/api/providers/provider/#Provider-getFeeData.
export async function getEIP1559Args(provider: ethers.Provider) {
    // If network support EIP1559 it returns: maxFeePerGas, ...
    const feeData = await provider.getFeeData();

    const maxFeePerGas = feeData.maxFeePerGas?.toString();
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas?.toString();
    // Check if chain supports EIP1559.
    if (maxFeePerGas && maxPriorityFeePerGas) {
        return {
            maxFeePerGas: maxFeePerGas.toString(),
            maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
            type: 2,
        };
    }
    // TODO: catch type1 tx args and return.
    return {};
}
