#! /usr/bin/env bash

SUBGRAPH_NAME="fluence-deal-contracts"

help() {
script_name="$(basename $0)"
cat<<HELP
Usage: [BASIC_AUTH_SUBGRAPH] ${script_name} network action
Deploy subgraph to Fluence.

  network       Fluence network to run against - local, stage, testnet or kras
  action        action to run - create, deploy or remove

Examples:
  BASIC_AUTH_SUBGRAPH=user:pass ${script_name} stage deploy     Deploy subgraph to stage
  ${script_name} local deploy                                   Deploy subgraph to local
HELP
}

# Print help if no arguments provided
! (($#)) && help && exit 0

# Parse script arguments
while (($#)); do
  case "$1" in
    deploy|create|remove)
      action="$1"
      shift
      ;;
    local|stage|testnet|kras)
      network="$1"
      shift
      ;;
    -h|--help)
      help
      exit 0
      ;;
    *)
      echo "Unknown argument '$1'."
      help
      exit 1
  esac
done

# Prepare variables depending on network
case "$network" in
  local)
    GRAPHNODE_URL="${GRAPHNODE_URL:-http://localhost:8020}"
    IPFS_URL="${IPFS_URL:-http://localhost:5001}"
    ;;
  stage|testnet|kras)
    if [[ -z $BASIC_AUTH_SUBGRAPH ]]; then
      echo "Please provide credentials with 'BASIC_AUTH_SUBGRAPH' variable."
      exit 1
    else
      basic_auth="${BASIC_AUTH_SUBGRAPH}@"
    fi
    GRAPHNODE_URL="https://${basic_auth}graph-node-admin.fluence.dev"
    IPFS_URL="https://${basic_auth}graph-node-ipfs.fluence.dev"
esac

# Prepare subgraph version label.
SUBGRAPH_VERSION_LABEL="${SUBGRAPH_VERSION_LABEL:-0.0.0}"

# Wait for graph-node to be up
retries=20
echo "Trying to connect to Graph Node at ${GRAPHNODE_URL}..."
while [[ $retries > 0 ]]; do
  status_code=$(curl -o /dev/null -s -w "%{http_code}\n" -X POST -H "Content-Type: application/json" -d '{"foo":"bar"}' ${GRAPHNODE_URL})
  if [[ $status_code == "200" ]]; then
    echo "Succesfully connected to Graph Node."
    sleep 10
    break
  else
    echo "Couldn't connect to Graph Node. Retrying in 5 seconds (retries left: ${retries})"
    sleep 5
    ((retries--))
  fi

  if [[ $retries == 0 ]]; then
    echo "Failed to connect to Graph Node."
    exit 1
  fi
done

# STAND_TO_SUBGRAPH_NETWORK mapping.
# The same as in the scripts/import-config-networks.ts.
# Kinda TODO: locate to 1 place.
case "$network" in
  local)
    SUBGRAPH_NETWORK="localhost"
    ;;
  stage)
    SUBGRAPH_NETWORK="stage"
    ;;
  testnet|kras)
    SUBGRAPH_NETWORK="mumbai"
    ;;
esac

case "$action" in
  deploy)
    echo "Deploying subgraph on ${network} stand with subgraph name: $SUBGRAPH_NAME and version label $SUBGRAPH_VERSION_LABEL..."
    graph deploy --node ${GRAPHNODE_URL} --ipfs ${IPFS_URL} --network ${SUBGRAPH_NETWORK} --network-file configs/${network}-networks-config.json --version-label ${SUBGRAPH_VERSION_LABEL} ${SUBGRAPH_NAME}
    ;;
  create)
    echo "Creating subgraph on Fluence with name: $SUBGRAPH_NAME..."
    graph create --node ${GRAPHNODE_URL} ${SUBGRAPH_NAME}
    ;;
  remove)
    echo "Removing subgraph on Fluence with name: $SUBGRAPH_NAME..."
    graph remove --node ${GRAPHNODE_URL} ${SUBGRAPH_NAME}
    ;;
esac
