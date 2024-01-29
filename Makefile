-include .env
export

.DEFAULT_GOAL := help
.PHONY: help

CHAIN_RPC_URL ?= http://chain-rpc:8545

verify-command: ## Verify command
	@command -v $(program) > /dev/null || (echo "\033[0;31m$(program) is not installed. Please install $(program) and try again.\033[0m" && exit 1)

install-npms: ## Install and deal-ts-clients and subgraph
	@make verify-command program=npm
	@cd ts-client && npm install
	@cd subgraph && npm install
	@echo "\033[0;32mSuccess! Run npm install in both npm modules: ts-client and subgraph.\033[0m"

build-contracts: ## Build contracts
	@make verify-command program=forge
	@forge build
	@echo "\033[0;32mSuccess! Build of contracts completed.\033[0m"

build-ts-client: ## Run build in node package: ts-client/
	@make verify-command program=npm
	@cd ts-client && npm run build
	@echo "\033[0;32mSuccess! Build of ts-clients completed.\033[0m"

build-subgraph: ## Build subgraph
	@make verify-command program=npm
	@cd subgraph && npm run compile && npm run import-config-networks
	@echo "\033[0;32mSuccess! Build of subgraph completed.\033[0m"

build-npms: ## Build all npms: subgraph and ts-clients
	@make build-ts-client
	@make build-subgraph
	@echo "\033[0;32mSuccess! Build of all NPM packages completed.\033[0m"

build-all: build-contracts build-npms ## Build contracts and npms

run-tests:  ## Test for solidity contracts & ts-clients
	@make verify-command program=forge
	@forge test
	@cd ts-client && npm run test
	@echo "\033[0;32mSuccess! Tests passed.\033[0m"

start-local-chain: ## Start local chain
	@make verify-command program=anvil
	@anvil --host 0.0.0.0 --block-time 15 --state /data/state.db

start-local-subgraph: ## Start local subgraph
	@make verify-command program=npm
	@cd subgraph && npm run create:local && npm run deploy:local

deploy-local: ## Deploy contracts to local
	@make verify-command program=forge
	@CONTRACTS_ENV_NAME=local forge script script/Deploy.s.sol --rpc-url local  \
	--mnemonics "test test test test test test test test test test test junk" \
	--sender 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 --broadcast

	@echo "\033[0;32mSuccess! Contracts deployed to local chain.\033[0m"

deploy-contracts-in-docker: ## Deploy contracts in docker
	@make verify-command program=forge
	@CONTRACTS_ENV_NAME=local forge script script/Deploy.s.sol --rpc-url $(CHAIN_RPC_URL) \
	--mnemonics "test test test test test test test test test test test junk" \
	--sender 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 --broadcast

	@echo "\033[0;32mSuccess! Contracts deployed to local chain.\033[0m"

deploy-%: ## Deploy to ...
	@make verify-command program=forge
	@CONTRACTS_ENV_NAME=$* forge script script/Deploy.s.sol --rpc-url $* \
	--private-key $(PRIVATE_KEY) --broadcast

	@echo "\033[0;32mSuccess! Contracts deployed to $* chain.\033[0m"

create-pure-market-local: ## Create market on a local blockchain
	@make verify-command program=forge
	@CONTRACTS_ENV_NAME=local forge script script/CreateMarket.s.sol --rpc-url local  \
	--mnemonics "test test test test test test test test test test test junk" \
	--sender 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 --broadcast

	@echo "\033[0;32mSuccess! Pure market created on local chain - check it out.\033[0m"

create-pure-market-%: ## Create market on for a stand...
	@make verify-command program=forge
	@CONTRACTS_ENV_NAME=$* forge script script/CreateMarket.s.sol --rpc-url $*  \
	--private-key $(PRIVATE_KEY) --broadcast

	@echo "\033[0;32mSuccess! Pure market created on $* chain - check it out.\033[0m"

help: ## List makefile targets
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
	| awk 'BEGIN {FS = ":.*?## "}; {printf "%-30s %s\n", $$1, $$2}'
