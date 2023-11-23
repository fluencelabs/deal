include .env
export

verify-command:
	@command -v $(program) > /dev/null || (echo "$(program) is not installed. Please install $(program) and try again." && exit 1)

build: 
	@make verify-command program=forge
	@forge build

update-abi:
	@make verify-command program=jq
	@make build
	
	@jq -r ".abi" out/Core.sol/Core.json > ts-client/abi/Core.json
	@jq -r ".abi" out/Deal.sol/Deal.json > ts-client/abi/Deal.json
	@jq -r ".abi" out/Core.sol/Core.json > subgraph/abis/Core.json
	@jq -r ".abi" out/Deal.sol/Deal.json > subgraph/abis/Deal.json

	@echo "Success! ABI updated."

start-local-chain:
	@make verify-command program=anvil
	@anvil --host 0.0.0.0 --block-time 1

deploy-local:
	@make verify-command program=forge
	@forge script script/Deploy.s.sol --rpc-url local  \
	--mnemonics "test test test test test test test test test test test junk" \
	--sender 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 --broadcast

deploy-%:
	@make verify-command program=forge
	@forge script script/Deploy.s.sol --rpc-url $* \
	--private-key $(PRIVATE_KEY)


