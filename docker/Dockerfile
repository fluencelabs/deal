FROM ubuntu:22.04 as foundry

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

FROM ubuntu:22.04 as contracts

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

FROM contracts as chain-rpc
ENTRYPOINT ["make"]
CMD ["start-local-chain"]

FROM contracts as deal-deploy-script
ENTRYPOINT ["make"]
CMD ["deploy-docker"]

FROM contracts as dev
ENTRYPOINT ["sleep", "infinity"]
