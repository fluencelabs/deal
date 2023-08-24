FROM node:16-alpine
COPY ./ /aurora
WORKDIR /aurora
RUN npm install --f && npm run compile
CMD npm run contracts:localnet
