// This module relates to deal-explorer-client.
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    overwrite: true,
    schema: "http://localhost:8000/subgraphs/name/fluence-deal-contracts",
    documents: "src/dealExplorerClient/indexerClient/queries/*.graphql",
    emitLegacyCommonJSImports: false,
    generates: {
        "src/dealExplorerClient/indexerClient/generated.types.ts": {
            plugins: [
              {
                add: {
                  content: '/* eslint-disable */\n//@ts-nocheck'
                }
              },
              "typescript"
            ],
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
            plugins: [
              {
                add: {
                  content: '/* eslint-disable */\n//@ts-nocheck'
                }
              },
              "typescript-operations", "typescript-graphql-request"
            ],
            // TODO: add hook on after generation.
            hooks: {
              afterOneFileWrite: (filenamePath: string) => {
                console.log(filenamePath);
              }
            }
        },
    },
};

export default config;
