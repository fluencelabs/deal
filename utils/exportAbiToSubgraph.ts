import path from "path";
import fs from "fs";

const SUBGRAPH_ABI_DIR = path.join(__dirname, "..", "subgraph", "abis");

// TODO: make by 1 hardhat task? reuse better and robust logic from subgraph-plugin?
// Subgraph could not work with artifacts of sol compiler or hardhat-deploy plugin,
//  because it used to work only with json file consists of only ABI.
export function saveAbiToSubgraph(abi: any, contractName: string) {
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
