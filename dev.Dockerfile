FROM node:14-slim AS builder

RUN mkdir /app
WORKDIR /app

COPY src /app/src/
COPY package.json tsconfig.json jest.config.ts yarn.lock /app/
COPY __tests__ /app/__tests__/
RUN cd /app && yarn install

ENTRYPOINT [ "yarn", "dev" ]
