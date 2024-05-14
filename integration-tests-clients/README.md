# Integration Tests For Fluence Contract Clients

i.e. offchain matcher client, Fluence cli client - with additional dependencies on Subgraph and Chain RPC.

## Initialization

> To run these tests, you need the following services up and running: **subgraph**, **chain-rpc**
> Easiest way to run them is via docker compose. For this, you need to have SNAPSHOT_ID from the e2e action in this repo's PRs.

-   Start Docker services by the following command: `SNAPHSHOT_ID=abcdef-1234-1 docker compose up -d`
-   Build ts-client package locally or provide the version from private _npm_ registry. The package is published to the private registry after PR's e2e test finishes.

### How to build ts-client package locally and use it

-   Run the following command `cd ts-client && npm i && npm run build && npm pack`
-   Copy the created archive to **integration-tests** folder
    -   or you could use 1 lined command: `npm i -s ../ts-client/fluencelabs-deal-ts-clients-0.7.3.tgz`
-   Put the archive name to **package.json** e.g. `"@fluencelabs/deal-ts-clients": "./fluencelabs-deal-ts-clients-0.2.22.tgz",`
-   Run `npm i`
