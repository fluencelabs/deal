# Use the latest foundry image
FROM ghcr.io/foundry-rs/foundry as contracts
RUN apk add make
WORKDIR /app
COPY . /app
RUN make build-contracts

FROM contracts as chain-rpc
ENTRYPOINT ["make"]
CMD ["start-local-chain"]

FROM contracts as deal-deploy-script
ENTRYPOINT ["make"]
CMD ["deploy-docker"]

FROM contracts as dev
ENTRYPOINT ["sleep", "infinity"]
