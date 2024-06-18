-include .env
export

.DEFAULT_GOAL := help
.PHONY: help

CHAIN_RPC_URL ?= http://chain-rpc:8545
LOCAL_CHAIN_BLOCK_MINING_INTERVAL ?= 1

verify-command: ## Verify command
	@command -v $(program) > /dev/null || (echo "\033[0;31m$(program) is not installed. Please install $(program) and try again.\033[0m" && exit 1)

fmt-contracts:
	@forge fmt
	@FOUNDRY_PROFILE=test forge fmt

clean:
	@forge clean
	@FOUNDRY_PROFILE=test forge clean

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

build-all: ## Build contracts and npms
	@make build-contracts
	@make build-npms

test-contracts:
	@make verify-command program=forge
	@forge build
	@FOUNDRY_PROFILE=test forge test 
	@echo "\033[0;32mSuccess! Contract tests passed.\033[0m"

test-ts-client:
	@make verify-command program=test
	@cd ts-client && npm run test
	@echo "\033[0;32mSuccess! Tests passed.\033[0m"

test-all:  ## Test for solidity contracts & ts-clients
	@make verify-command program=forge
	@make test-contracts
	@cd ts-client && npm run test
	@echo "\033[0;32mSuccess! Tests passed.\033[0m"

start-local-chain: ## Start local chain
	@make verify-command program=anvil
	@anvil --host 0.0.0.0 --block-time $(LOCAL_CHAIN_BLOCK_MINING_INTERVAL) --balance "100000000000000" --state /data/state.db

deploy-subgraph-%: ## Deploy subgraph to network {local, kras, dar, stage}
	@make verify-command program=npm
	@cd subgraph && npm run create:$* && npm run deploy:$*

delete-subgraph-%: ## Delete subgraph from network {local, kras, dar, stage}, do not forget to set SUBGRAPH_NAME_TO_DELETE
	@make verify-command program=npm
	@cd subgraph  && npm run delete:$*

deploy-contracts-local: ## Deploy contracts to local network
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

deploy-contracts-stage: ## Deploy to stage (IPC)
	@make verify-command program=forge
	@CONTRACTS_ENV_NAME=stage forge script script/Deploy.s.sol --rpc-url stage \
	--private-key $(PRIVATE_KEY) --broadcast --skip-simulation --slow

	@echo "\033[0;32mSuccess! Contracts deployed to $* chain.\033[0m"

deploy-contracts-dar: ## Deploy to dar (IPC)
	@make verify-command program=forge
	@CONTRACTS_ENV_NAME=dar forge script script/Deploy.s.sol --rpc-url dar \
	--private-key $(PRIVATE_KEY) --broadcast --skip-simulation --slow

	@echo "\033[0;32mSuccess! Contracts deployed to $* chain.\033[0m"

deploy-contracts-kras: ## Deploy to kras (IPC)
	@make verify-command program=forge
	@CONTRACTS_ENV_NAME=kras forge script script/Deploy.s.sol --rpc-url kras \
	--private-key $(PRIVATE_KEY) --broadcast --skip-simulation --slow

	@echo "\033[0;32mSuccess! Contracts deployed to $* chain.\033[0m"

deploy-contracts%: ## Deploy contracts to ...
	@make verify-command program=forge
	@CONTRACTS_ENV_NAME=$* forge script script/Deploy.s.sol --rpc-url $* \
	--private-key $(PRIVATE_KEY) --broadcast

	@echo "\033[0;32mSuccess! Contracts deployed to $* chain.\033[0m"

create-pure-market-local: ## Create market on a local blockchain with Anvil mnemonic (do not use it with stage,dar,kras)
	@make verify-command program=forge
	@cd ts-client && npm run create-pure-market-script

	@echo "\033[0;32mSuccess! Pure market created on local chain - check it out.\033[0m"

help: ## List makefile targets
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
	| awk 'BEGIN {FS = ":"}; {printf "%-30s %s\n", $$2, $$3}'
