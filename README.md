# 💰 Flowdesk midprice-service

This repository is the answer to the technical test at [Flowdesk](https://www.flowdesk.co/). More info in the [instruction](./instructions/readme.md)

- [💰 Flowdesk midprice-service](#-flowdesk-midprice-service)
  - [🐣 Getting started](#-getting-started)
  - [🤖 Technical documentation](#-technical-documentation)
    - [Typescript](#typescript)
    - [Volta](#volta)


## 🐣 Getting started

1. Clone the repository with `git clone`.
2. Make sure your node version is `node@22`. If you use `volta` it should automatically be set up with the right one.
3. Run `npm i` to install dependencies.
4. Now you can
   1. Test your app with `npm run test`
   2. Run your app in dev mode with a watcher with `npm run dev`
   3. Build your app with `npm run build`
   4. Start your production app with `npm run start`

## 🤖 Technical documentation
### Typescript
This project is written in [typescript](https://www.typescriptlang.org/), build with `tsc` and executable with `node`.

### Volta

This project is using [volta](https://docs.volta.sh/guide/getting-started), the field `.volta` in `package.json` file can help to pin the node's version on our development computer.