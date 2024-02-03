#! /usr/bin/env bash

# Create /testnet/genesis.json
mkdir /testnet
fendermint genesis --genesis-file /testnet/genesis.json \
  new \
    --chain-name test \
    --base-fee 1000 \
    --timestamp 1680101412 \
    --power-scale 0

# Create /testnet/keys
mkdir /testnet/keys
for NAME in alice bob charlie dave; do
  fendermint key gen --out-dir /testnet/keys --name $NAME;
done

# Add alice key as a stand-alone account
fendermint genesis --genesis-file /testnet/genesis.json \
  add-account \
    --public-key /testnet/keys/alice.pk \
    --balance 10 \
    --kind ethereum

# Add multi-sig account
fendermint genesis --genesis-file /testnet/genesis.json \
  add-multisig \
    --public-key /testnet/keys/bob.pk \
    --public-key /testnet/keys/charlie.pk \
    --public-key /testnet/keys/dave.pk \
    --threshold 2 \
    --vesting-start 0 \
    --vesting-duration 1000000 \
    --balance 30

# Add bob as validator
fendermint genesis --genesis-file /testnet/genesis.json \
  add-validator \
    --public-key /testnet/keys/bob.pk \
    --power 1

# Convert genesis file to cometbft format
mkdir /cometbft
fendermint genesis --genesis-file /testnet/genesis.json \
  into-tendermint \
    --out /cometbft/genesis.json

# Convert bob key to cometbft format
fendermint \
  key into-tendermint \
    --secret-key /testnet/keys/bob.sk \
    --out /cometbft/priv_validator_key.json
