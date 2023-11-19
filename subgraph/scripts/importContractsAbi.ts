import path from "path";
import fs from "fs";
import {asyncRuntimeDecorator} from "./utils";
import {ContractsENV, DEAL_CONFIG} from "../../src/client/config";

const DEFAULT_NETWORK_FOR_ABI = 'localhost'
const SUBGRAPH_ABI_DIR = path.join(__dirname, "..", "abis");


// It imports contracts abi from hardhat-deployments artifacts by providing chain id.
//  Uses only contracts declared in CONTRACT_NAME_TO_FACTORY.
async function importContrastAbi(networkName: ContractsENV) {
    const config = await DEAL_CONFIG[networkName]()
    _writeContractAbiSync(config.coreImplAbi, 'CoreImpl')
    // TODO: add other contracts below...
}

// Subgraph could not work with artifacts of sol compiler or hardhat-deploy plugin,
//  because it used to work only with json file consists of only ABI.
function _writeContractAbiSync(abi: any, contractName: string) {
    const abiPath = path.join(SUBGRAPH_ABI_DIR, contractName + ".json")
    if (!fs.existsSync(SUBGRAPH_ABI_DIR)) {
        fs.mkdirSync(SUBGRAPH_ABI_DIR)
    }
    console.log("Write contract abi to " + abiPath + "...")
    fs.writeFileSync(
        abiPath,
        JSON.stringify(abi, undefined, 2)
    )
}

async function main() {
    await importContrastAbi(DEFAULT_NETWORK_FOR_ABI)
}

// the main.
asyncRuntimeDecorator(main)
