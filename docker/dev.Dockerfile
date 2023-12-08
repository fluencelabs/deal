# Use the latest foundry image
FROM ghcr.io/foundry-rs/foundry
RUN apk add make

WORKDIR /app
COPY . /app

RUN make build-contracts

FROM node:18.16
CMD ["sleep",  "infinity"]
WORKDIR /app
