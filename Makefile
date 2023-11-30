-include .env
export

verify-command:
	@command -v $(program) > /dev/null || (echo "\033[0;31m$(program) is not installed. Please install $(program) and try again.\033[0m" && exit 1)

build-contracts: 
	@make verify-command program=forge
	@forge build

build:
	@make update-abi
	@cd ts-client && npm run build

	@echo "\033[0;32mSuccess! Build complete.\033[0m"

update-abi:
	@make verify-command program=jq
	@make build-contracts
	
	# add abi to ts-client
	@jq -r ".abi" out/Core.sol/Core.json > ts-client/abi/Core.json
	@jq -r ".abi" out/Deal.sol/Deal.json > ts-client/abi/Deal.json

	# add abi to subgraph
	@jq -r ".abi" out/Core.sol/Core.json > subgraph/abis/Core.json
	@jq -r ".abi" out/Deal.sol/Deal.json > subgraph/abis/Deal.json
	@jq -r ".abi" out/ERC20.sol/ERC20.json > subgraph/abis/ERC20.json


	@echo "\033[0;32mSuccess! ABI updated.\033[0m"

start-local-chain:
	@make verify-command program=anvil
	@anvil --host 0.0.0.0 --block-time 1

deploy-local:
	@make verify-command program=forge
	@forge script script/Deploy.s.sol --rpc-url anvil-node  \
	--mnemonics "test test test test test test test test test test test junk" \
	--sender 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 --broadcast

	@echo "\033[0;32mSuccess! Contracts deployed to local chain.\033[0m"

deploy-docker:
	@make verify-command program=forge
	@forge script script/Deploy.s.sol --rpc-url http://anvil-node:8545  \
	--mnemonics "test test test test test test test test test test test junk" \
	--sender 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 --broadcast

	@echo "\033[0;32mSuccess! Contracts deployed to local chain.\033[0m"

deploy-%:
	@make verify-command program=forge
	@forge script script/Deploy.s.sol --rpc-url $* \
	--private-key $(PRIVATE_KEY)

	@echo "\033[0;32mSuccess! Contracts deployed to $* chain.\033[0m"



