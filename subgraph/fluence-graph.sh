#! /usr/bin/env bash
set -e

SUBGRAPH_NAME_PREFIX="fluence-deal-contracts"
# Directory with saved deployments. It will append rows with other deployments.
SUBGRAPH_DEPLOYMENTS_DIR="deployments"

help() {
script_name="$(basename $0)"
cat<<HELP
Usage: [BASIC_AUTH_SUBGRAPH] ${script_name} network action
Deploy subgraph to Fluence stands, or local. Store deployment artifacts (local is ignored).

  network       Fluence network to run against - local, stage, dar or kras
  action        action to run - create, deploy or delete

Examples:
  BASIC_AUTH_SUBGRAPH=user:pass ${script_name} stage deploy     Deploy subgraph to stage
  ${script_name} local deploy                                   Deploy subgraph to local (BASIC_AUTH_SUBGRAPH not used)

Envs:
  - GRAPHNODE_ADMIN_URL_LOCAL: url for local network admin graph panel.
  - GRAPHNODE_QUERY_URL_LOCAL: url for local network graph query
  - SUBGRAPH_NAME_TO_DELETE: e.g. for local fluence-deal-contracts
HELP
}

# Print help if no arguments provided
! (($#)) && help && exit 0

# Parse script arguments
while (($#)); do
  case "$1" in
    deploy|create)
      action="$1"
      shift
      ;;
    delete)
      action="$1"
      if [[ -z $SUBGRAPH_NAME_TO_DELETE ]]; then
          echo "For delete action SUBGRAPH_NAME_TO_DELETE is required."
          exit 1
      fi
      shift
      ;;
    local|stage|kras|dar)
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
    GRAPHNODE_URL="${GRAPHNODE_ADMIN_URL_LOCAL:-http://localhost:8020}"
    IPFS_URL="${IPFS_URL:-http://localhost:5001}"
    ;;
  stage|kras|dar)
    if [[ -z $BASIC_AUTH_SUBGRAPH ]]; then
      echo "Please provide credentials with 'BASIC_AUTH_SUBGRAPH' variable."
      exit 1
    else
      basic_auth="${BASIC_AUTH_SUBGRAPH}@"
    fi
    GRAPHNODE_URL="https://${basic_auth}graph-node-admin.${network}.fluence.dev"
    IPFS_URL="https://graph-node-ipfs.${network}.fluence.dev"
esac

# Prepare subgraph version label.
# Do we need this [currently no]?
#  ref to https://github.com/graphprotocol/graph-node/pull/696
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
# Kinda TODO: locate to 1 place (now it is duplicated in the scripts/import-config-networks.ts as well)
case "$network" in
  local)
    SUBGRAPH_NETWORK="local"
    ;;
  stage)
    SUBGRAPH_NETWORK="stage"
    ;;
  dar)
    SUBGRAPH_NETWORK="dar"
    ;;
  kras)
    SUBGRAPH_NETWORK="kras"
    ;;
esac

case "$network" in
  local)
    SUBGRAPH_NAME="${SUBGRAPH_NAME_PREFIX}"
    ;;
  stage|kras|dar)
    echo "Prepare deployment log (append url to deployments with commit hash specified)..."
    SUBGRAPH_NAME="${SUBGRAPH_NAME_PREFIX}-$(git rev-parse --short HEAD)"
    ;;
esac

DEPLOYMENT_LOG_PATH="${SUBGRAPH_DEPLOYMENTS_DIR}/${network}.txt"
case "$action" in
  deploy)
    echo "Deploying subgraph on ${network} stand with subgraph name: ${SUBGRAPH_NAME} and version label ${SUBGRAPH_VERSION_LABEL}..."
    auth_header=$(echo -n ${BASIC_AUTH_SUBGRAPH} | base64)
    graph deploy --node ${GRAPHNODE_URL} --headers "{\"Authorization\": \"Basic ${auth_header}\"}" --ipfs ${IPFS_URL} --network ${SUBGRAPH_NETWORK} --network-file configs/${network}-networks-config.json --version-label ${SUBGRAPH_VERSION_LABEL} ${SUBGRAPH_NAME}
    # Finally store logs if needed.
    if [[ $network == "local" ]]; then
      echo "Update of artifacts of local network is ignored."
    else
      echo "Append deployment URL: ${SUBGRAPH_NAME} into ${DEPLOYMENT_LOG_PATH}..."
      echo "${SUBGRAPH_NAME}" >> ${DEPLOYMENT_LOG_PATH}
    fi
    ;;
  create)
    echo "Creating subgraph on ${network} with name: ${SUBGRAPH_NAME}..."
    graph create --node ${GRAPHNODE_URL} ${SUBGRAPH_NAME}
    ;;
  delete)
    echo "Deleting subgraph on ${network} network with name: ${SUBGRAPH_NAME_TO_DELETE} from ${GRAPHNODE_URL}..."
    graph remove --node ${GRAPHNODE_URL} ${SUBGRAPH_NAME_TO_DELETE}
    if [[ $network == "local" ]]; then
      echo "Update of artifacts of local network is ignored."
    else
      echo "Update artifacts in: ${DEPLOYMENT_LOG_PATH}"
      sed -e "s/${SUBGRAPH_NAME_TO_DELETE}//g" -i '' ${DEPLOYMENT_LOG_PATH}
      # Delete empty lines as well.
      sed -e '/^$/d' -i '' ${DEPLOYMENT_LOG_PATH}
    fi
    ;;
esac
