FROM node:lts-alpine

RUN mkdir -p /home/node/collector && chown -R node:node /home/node/collector

WORKDIR /home/node/collector

COPY package*.json yarn.* ./

USER node

RUN yarn

ENV PATH /home/node/collector/node_modules/.bin:$PATH

COPY --chown=node:node . .

RUN yarn build

CMD ["yarn", "start:dev"]
