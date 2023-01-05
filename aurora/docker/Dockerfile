FROM node:16-alpine
COPY ./contracts /aurora/contracts
COPY ./deploy /aurora/deploy
COPY ./utils /aurora/utils
COPY ./hardhat.config.ts /aurora/hardhat.config.ts
COPY ./package.json /aurora/package.json
COPY ./package-lock.json /aurora/package-lock.json
COPY ./tsconfig.json /aurora/tsconfig.json
WORKDIR /aurora
RUN npm install
RUN npm run clean
RUN npm run compile
CMD npm run node
