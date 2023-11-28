FROM nikolaik/python-nodejs:python3.11-nodejs16-bullseye
COPY ./ /aurora
WORKDIR /aurora
RUN npm install --f && npm run compile
CMD npm run contracts:localnet
