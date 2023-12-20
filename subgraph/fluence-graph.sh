#!/bin/sh
# Deploy on FluenceLabs stand (Currently only on stage).
#
# Example Run:
# >> export BASIC_AUTH_FLUENCE_STAGE=<check .example.env> && ./fluence-graph.sh

# Args:
# $1 - action {deploy, create}.

# Envs:
# - BASIC_AUTH_FLUENCE_STAGE

# Validate envs.
if [ "$BASIC_AUTH_FLUENCE_STAGE" = "" ]; then
  echo "Please provide 'BASIC_AUTH_FLUENCE_STAGE' env."
  exit 0
fi

# Choose auth string.
basic_auth=""
if [ "$BASIC_AUTH_FLUENCE_STAGE" != "" ]; then
  basic_auth="${BASIC_AUTH_FLUENCE_STAGE}@"
fi

SUBGRAPH_NAME=fluence-deal-contracts

if [ "$1" = "deploy" ]; then
  echo "Deploy subgraph on Fluence for stage env with subgraph name: $SUBGRAPH_NAME..."
  graph deploy --node https://${basic_auth}graph-node-admin.fluence.dev/ --ipfs https://${basic_auth}graph-node-ipfs.fluence.dev --network stage --network-file config/networks.json --version-label 0.0.0 ${SUBGRAPH_NAME}
elif [ "$1" = "create" ]; then
  echo "Create subgraph on Fluence with name: $SUBGRAPH_NAME..."
  graph create --node https://${basic_auth}graph-node-admin.fluence.dev ${SUBGRAPH_NAME}
else
  echo "Action: $1 is not allowed."
fi
