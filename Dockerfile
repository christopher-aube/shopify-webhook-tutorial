FROM node:14-slim AS builder

RUN mkdir /app
WORKDIR /app

COPY src src
COPY index.ts package.json tsconfig.json yarn.lock ./

RUN yarn install --frozen-lockfile && \
    yarn build

FROM node:14-slim

RUN mkdir /app
WORKDIR /app

COPY --from=builder /app/dist dist
COPY package.json yarn.lock ./
RUN yarn install --prod --frozen-lockfile

ARG EVENT_TOPIC
ARG REDIS_HOST
ARG REDIS_PORT
ARG SHOPIFY_SHARED_SECRET

ENTRYPOINT [ "yarn", "start" ]
