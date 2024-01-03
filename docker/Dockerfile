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
ADD https://raw.githubusercontent.com/foundry-rs/foundry/master/foundryup/install /opt/foundry/install
RUN bash /opt/foundry/install && /opt/foundry/bin/foundryup

# Base image with compiled contracts that is used by anvil and by deploy scripts
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

# image with local chain - anvil
FROM contracts as chain-rpc
ENTRYPOINT ["make"]
CMD ["start-local-chain"]

# image that deploys contracts to chain-rpc
FROM contracts as chain-deploy-script
ENTRYPOINT ["make"]
CMD ["deploy-docker"]

# image that deploys subgraph
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
