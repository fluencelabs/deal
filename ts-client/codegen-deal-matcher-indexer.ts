// This module relates to deal-explorer-client.
import type { CodegenConfig } from "@graphql-codegen/cli";
import { exec } from "child_process";

const config: CodegenConfig = {
    overwrite: true,
    schema: "http://localhost:8000/subgraphs/name/fluence-deal-contracts",
    documents: "src/dealMatcherClient/indexerClient/queries/*.graphql",
    emitLegacyCommonJSImports: false,
    generates: {
        "src/dealMatcherClient/indexerClient/generated.types.ts": {
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
        "src/dealMatcherClient/indexerClient/": {
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
            hooks: {
              // TODO: hook is a kinda trick here because of the graphql-client wrong imports for esm.
              //  Thus, basically we should migrate to another client.
              afterOneFileWrite: (filenamePath: string) => {
                console.log("[afterOneFileWrite] Execute 2 sed to change imports for file:", filenamePath);
                exec("sed -i '' -e \"s/import { GraphQLClient } from 'graphql-request';/import { GraphQLClient } from 'graphql-request';\\nimport type { RequestOptions } from 'graphql-request';/g\" " + filenamePath)
                exec("sed -i '' -e \"s/import { GraphQLClientRequestHeaders } from 'graphql-request\\/build\\/esm\\/types.js';/type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];/g\" " + filenamePath )
              }
            }
        },
    },
};

export default config;
