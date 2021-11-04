### README

## 概要

ローカル環境で APIGW+Lambda+Dynamodb の MOCK API

## 開発環境

- [docker for mac (3.5.1)](https://docs.docker.com/docker-for-mac/install/)
- [visual studio code](https://code.visualstudio.com/download)

## フレームワーク及び使用言語

- Nest.js
- serverless framework
- Node.js 14.x

### .env、.aws の追加

```
$ touch .env
$ cp -R ~/.aws docker/include/
```

### .env

```bash
APP=dynamodb
APP_ENV=local
DATA_DIR=/var/app
MOUNT_DIR=/var/app
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
SLS_DEBUG=*
OFFLINE=1
AWS_SDK_LOAD_CONFIG=1
```

##### AWS 環境の DynamoDB への接続する場合

- AWS_ACCESS_KEY_ID と AWS_SECRET_ACCESS_KEY に ID と KEY の値を入れる
- OFFLINE の値を 0 にすれば AWS 環境へ接続可能

### 環境構築

```bash
# コンテナのビルド
$ docker-compose build dynamodb
# ashでコンテナ内へ
$ make ash service=dynamodb
# npm モジュールインストール
$ npm i
```

### ローカル API 起動

```bash
# Swagger立ち上げ、serverless-offile起動、dynamodb-local起動
make dynamodb-api

# dynamodb-localはローカル端末で動作可能なDynamoDB互換のデータベース
# dynamodb-adminはGUIベースでDynamoDB Localの操作をする事ができる
# http://localhost:8001 でdynamodb-admin立ち上がる
# http://localhost:3100/api でswaggerが立ち上がる
```
