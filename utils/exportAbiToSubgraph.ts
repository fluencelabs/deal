import path from "path";
import fs from "fs";

const SUBGRAPH_ABI_DIR = path.join(__dirname, "..", "subgraph", "abis");

// TODO: make by 1 hardhat task.
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
