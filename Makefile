-include .env
export

verify-command:
	@command -v $(program) > /dev/null || (echo "\033[0;31m$(program) is not installed. Please install $(program) and try again.\033[0m" && exit 1)

install:
	@make verify-command program=npm
	@cd ts-client && npm install
	@cd subgraph && npm install

build-contracts: 
	@make verify-command program=forge
	@forge build

build:
	@make build-contracts
	@cd ts-client && npm run build
	@cd subgraph && npm run compile 

	@echo "\033[0;32mSuccess! Build complete.\033[0m"

start-local-chain:
	@make verify-command program=anvil
	@anvil --host 0.0.0.0 --block-time 15

deploy-local:
	@make verify-command program=forge
	@CONTRACTS_ENV_NAME=local forge script script/Deploy.s.sol --rpc-url local  \
	--mnemonics "test test test test test test test test test test test junk" \
	--sender 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 --broadcast

	@echo "\033[0;32mSuccess! Contracts deployed to local chain.\033[0m"

deploy-docker:
	@make verify-command program=forge
	@CONTRACTS_ENV_NAME=local forge script script/Deploy.s.sol --rpc-url http://anvil-node:8545  \
	--mnemonics "test test test test test test test test test test test junk" \
	--sender 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 --broadcast

	@echo "\033[0;32mSuccess! Contracts deployed to local chain.\033[0m"

deploy-%:
	@make verify-command program=forge
	@CONTRACTS_ENV_NAME=$* forge script script/Deploy.s.sol --rpc-url $* \
	--private-key $(PRIVATE_KEY) --broadcast

	@echo "\033[0;32mSuccess! Contracts deployed to $* chain.\033[0m"

create-pure-market-local:
	@make verify-command program=forge
	@CONTRACTS_ENV_NAME=local forge script script/CreateMarket.s.sol --rpc-url local  \
	--mnemonics "test test test test test test test test test test test junk" \
	--sender 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 --broadcast

	@echo "\033[0;32mSuccess! Pure market created on local chain - check it out.\033[0m"
