import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    overwrite: true,
    schema: "http://localhost:8000/subgraphs/name/fluence-deal-contracts",
    documents: "src/indexerClient/queries/*.graphql",
    generates: {
        "src/indexerClient/generated.types.ts": {
            plugins: ["typescript"],
            config: {
                scalars: {
                    BigInt: "string",
                },
                enumsAsTypes: true,
            },
        },
        "src/indexerClient/": {
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
