FROM node:16-alpine
COPY ./ /aurora
WORKDIR /aurora
RUN npm install \
    && npm run clean \
    && npm run compile
CMD npm run node
