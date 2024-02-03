FROM rust:buster as actors
RUN git clone --branch fluence https://github.com/fluencelabs/ipc.git
WORKDIR ipc/fendermint
RUN make actor-bundle

FROM ghcr.io/consensus-shipyard/fendermint:latest as fendermint
RUN --mount=type=bind,source=/scripts/fendermint-bootstrap.sh,target=/bootstrap.sh /bootstrap.sh
COPY --from=actors /ipc/fendermint/builtin-actors/output/bundle.car /fendermint/bundle.car
COPY --from=actors /ipc/fendermint/actors/output/custom_actors_bundle.car /fendermint/custom_actors_bundle.car

FROM cometbft/cometbft:v0.37.x as cometbft
USER root
COPY --from=fendermint /cometbft /cometbft-config
COPY scripts/cometbft-entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["start"]

FROM fendermint as fendermint-eth
COPY scripts/fendermint-eth-entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["run"]
