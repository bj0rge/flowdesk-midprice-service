# 💰 Flowdesk midprice-service

This repository is the answer to the technical test at [Flowdesk](https://www.flowdesk.co/). More info in the [instruction](./instructions/readme.md)

- [💰 Flowdesk midprice-service](#-flowdesk-midprice-service)
  - [🐣 Getting started](#-getting-started)
  - [🌐 API](#-api)
  - [🤖 Technical documentation](#-technical-documentation)
    - [🛠️ Typescript](#️-typescript)
    - [⚡ Volta](#-volta)
    - [🗄️ Database](#️-database)
  - [🚀 Future improvements](#-future-improvements)
    - [💶 Add a new crypto](#-add-a-new-crypto)
    - [🏦 Add a new exchange](#-add-a-new-exchange)
    - [✨ How to keep improving?](#-how-to-keep-improving)
      - [🛠️ Add automations](#️-add-automations)
      - [🧪 More tests!](#-more-tests)
    - [🏷️ Better naming (probably)](#️-better-naming-probably)
  - [✍️ License](#️-license)


## 🐣 Getting started

1. Clone the repository with `git clone`.
2. Make sure your node version is `node@22`. If you use `volta` it should automatically be set up with the right one.
3. Run `npm i` to install dependencies.
4. Now you can
   1. Test your app with `npm run test`
   2. Run your app in dev mode with a watcher with `npm run dev`
   3. Build your app with `npm run build`
   4. Start your production app with `npm run start`


## 🌐 API

How to access the project?

Once running, 2 endpoints are available:
- a healthcheck, at [http://127.0.0.1:3000](http://127.0.0.1:3000)
- the global price index getter, at **GET** `/global-price-index/:baseAsset/:quoteAsset` (see [http://127.0.0.1:3000/global-price-index/BTC/USDT](http://127.0.0.1:3000/global-price-index/BTC/USDT) as an example)

## 🤖 Technical documentation
### 🛠️ Typescript
This project is written in [typescript](https://www.typescriptlang.org/), build with `tsc` and `babel` and executable with `node`.

### ⚡ Volta

This project is using [volta](https://docs.volta.sh/guide/getting-started), the field `.volta` in `package.json` file can help to pin the node's version on our development computer.

### 🗄️ Database

This project doesn't use any database, everything is handled in memory. This is obviously not working for a real life usage, but for this technical test it is well enough.

## 🚀 Future improvements

As we need to take into consideration we may add new exchanges later, or new cryptos, this project can evolve.

### 💶 Add a new crypto

To add a new crypto, it will be needed to
- add it in the `config/default.json` config file (`service.globalPriceIndex.handledCryptos` attribute)
- handle the new crypto in the encoders in `src/clients/*/codec.ts`
- update the `supportedPairs` in `src/domain/crypto.ts`

### 🏦 Add a new exchange

To handle a new exchange, you will need to
- add it in the `config/default.json` config file along with its URIs (`clients` attribute)
- add it in the `exchanges` variable in `src/domain/exchange.ts`
- create the client in `src/clients` (do not forget to export it in the `index.ts`)
- create the exchange library in `src/libraries/exchanges` (do not forget to export it in the `index.ts`)
- add the new builder in `src/libraries/globalPriceIndex/index.ts`

### ✨ How to keep improving?

#### 🛠️ Add automations

The dev-x is pretty poor so far. It would be a lot healthier to add at least
- hooks to typecheck and lint on git commit
- some CI to automatically run test on PR

#### 🧪 More tests!

Ideally, we would have contract tests. At the deploy step, an action would subscribe to the 3 APIs we use to get the specs (in OpenAPI format or any other one) and validate our clients against it.
I have no idea if such an API specification format exist for websockets though ¯\\\_(ツ)\_/¯

We can also consider adding service tests, which hasn't been done here to timebox the project.

### 🏷️ Better naming (probably)

I'm not a crypto-pro; hence, it's very possible that some variable namings happen to be poor, and don't fit the domain in the best way. In any case, with a better domain-knowledge, I could have done a better code.

## ✍️ License

Licensed under [Beer-ware](./LICENSE).