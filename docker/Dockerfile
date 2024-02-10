# Multistage dockerfile
# https://docs.docker.com/build/building/multi-stage

# Since official foundry image is built to run only on amd64 and
# doesn't support arm64 we are making our own foundry image
FROM ubuntu:22.04 as foundry

# install packages that are required for foundry installation
RUN \
  apt-get update && \
  apt-get install -y --no-install-recommends \
  	curl \
    ca-certificates \
    git && \
  apt-get clean && \
  rm -rf \
  	/tmp/* \
  	/var/lib/apt/lists/* \
  	/var/tmp/*
ENV FOUNDRY_DIR /opt/foundry
RUN curl -sS https://raw.githubusercontent.com/foundry-rs/foundry/master/foundryup/install | bash && /opt/foundry/bin/foundryup

# Image with compiled actors
FROM rust:buster as actors
RUN git clone --branch fluence https://github.com/fluencelabs/ipc.git
WORKDIR ipc/fendermint
RUN make actor-bundle

# Base image with compiled contracts
FROM ubuntu:22.04 as contracts

# install packages that are required for building contracts
RUN \
  apt-get update && \
  apt-get install -y --no-install-recommends \
  	make \
    git \
    linux-headers-generic \
    ca-certificates && \
  apt-get clean && \
  rm -rf \
  	/tmp/* \
  	/var/lib/apt/lists/* \
  	/var/tmp/*

COPY --from=foundry /opt/foundry/bin /opt/foundry
ENV PATH="${PATH}:/opt/foundry/"

COPY . /app
WORKDIR /app

RUN make build-contracts

# IPC
FROM fluencelabs/fendermint:latest as ipc
COPY docker/keys /testnet/keys
RUN --mount=type=bind,source=docker/scripts/fendermint-bootstrap.sh,target=/bootstrap.sh /bootstrap.sh
COPY --from=actors /ipc/fendermint/builtin-actors/output/bundle.car /fendermint/bundle.car
COPY --from=actors /ipc/fendermint/actors/output/custom_actors_bundle.car /fendermint/custom_actors_bundle.car

# Blockchain
FROM cometbft/cometbft:v0.37.x as cometbft
USER root
COPY --from=ipc /cometbft /cometbft-config
COPY docker/scripts/cometbft-entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["start"]

# Image that deploys contracts to IPC
FROM contracts as ipc-deploy-script
ENTRYPOINT ["make"]
CMD ["deploy-to-ipc"]

# Image that deploys subgraph
FROM contracts as subgraph-deploy-script

# install packages that are required for nodejs installation
RUN \
 apt-get update && \
 apt-get install -y --no-install-recommends \
   curl \
   gpg && \
 apt-get clean && \
 rm -rf \
	/tmp/* \
	/var/lib/apt/lists/* \
	/var/tmp/*

# install nodejs 18.x
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | gpg --dearmor > /usr/share/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x jammy main" > /etc/apt/sources.list.d/nodesource.list
RUN \
 apt-get update && \
 apt-get install -y --no-install-recommends \
   nodejs && \
 apt-get clean && \
 rm -rf \
	/tmp/* \
	/var/lib/apt/lists/* \
	/var/tmp/*

# copy updated deployments files
# needed mostly in CI since deployments/local.json changes after we built 'contracts' image
COPY ./deployments /app/deploymens
RUN cd subgraph && npm install && npm run compile && npm run import-config-networks

ENTRYPOINT ["make"]
CMD ["start-local-subgraph"]

# dev image used in dev.docker-compose.yaml
FROM contracts as dev
ENTRYPOINT ["sleep", "infinity"]
