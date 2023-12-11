// This module relates to deal-explorer-client.
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    overwrite: true,
    schema: "http://localhost:8000/subgraphs/name/fluence-deal-contracts",
    documents: "src/dealExplorerClient/indexerClient/queries/*.graphql",
    generates: {
        "src/dealExplorerClient/indexerClient/generated.types.ts": {
            plugins: ["typescript"],
            config: {
                scalars: {
                    BigInt: "string",
                },
                enumsAsTypes: true,
            },
        },
        "src/dealExplorerClient/indexerClient/": {
            preset: "near-operation-file",
            presetConfig: {
                extension: ".generated.ts",
                baseTypesPath: "generated.types.ts",
            },
            plugins: ["typescript-operations", "typescript-graphql-request"],
        },
    },
};

export default config;
