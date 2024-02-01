# Integration tests

## Initialization

> To run these tests, you need the following services up and running: **subgraph**, **chain-rpc**
> Easiest way to run them is via docker compose. For this, you need to have SNAPSHOT_ID from the e2e action in this repo's PRs.

- Start Docker services by the following command: `SNAPHSHOT_ID=abcdef-1234-1 docker compose up -d`
- Build ts-client package locally or provide the version from private *npm* registry. The package is published to the private registry after PR's e2e test finishes.


### How to build ts-client package locally and use it

- Run the following command `cd ts-client && npm i && npm run build`
- Copy the created archive to **integration-tests** folder
- Put the archive name to **package.json** e.g. `"@fluencelabs/deal-ts-clients": "./fluencelabs-deal-ts-clients-0.2.22.tgz",`
- Run `npm i`