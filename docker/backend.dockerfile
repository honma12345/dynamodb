FROM node:14-alpine

ARG DATA_DIR
ARG APP
ARG APP_ENV

RUN mkdir -p /var/app
RUN apk add git

ENV PATH $PATH:./node_modules/.bin
WORKDIR ${DATA_DIR}

RUN npm update -g npm
RUN npm config set unsafe-perm true
RUN npm -g install serverless
RUN npm install -g @nestjs/cli
RUN npm install -g typedoc
RUN mkdir -p ${DATA_DIR}/env
RUN mkdir -p /app/env
RUN mkdir -p /root/.aws
ADD include/.aws /root/.aws

EXPOSE 3000
