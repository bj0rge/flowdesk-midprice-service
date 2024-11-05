# Flowdesk Technical Test

## Overview

As a market maker, having a global price index is essential.
To do that, we are using orderbook data provided by exchanges and computing them to have a fair mid-price (the average between best bid and best ask.)

Here is an example of an orderbook with asks and bids :

![Orderbook](./orderbook.png)

More information about what is an orderbook: [here](https://www.investopedia.com/terms/o/order-book.asp)

## Goals

Expose a REST API which gives us the global price index of the trading pair BTC/USDT, computed from 3 different exchanges :

1. Binance
2. Kraken
3. Huobi

## Specifications

Your mission, if you accept it, will be to fetch the BTC/USDT order book from the 3 exchanges written above; compute for each orderbook a mid-price and finally return an average of these mid-prices. You have to take into consideration that you may add new exchanges later.

**Requirements**
- Use NodeJS and Typescript
- You will have to publish your source code in a VCS
- You must collect at least one orderbook using http apis provided by the exchange
- You must collect at least one orderbook using websocket client by relying on a streamed orderbook channel provided by the exchange

**The delivered implementation should be battle-tested!**

**You should rely on the exchange API for the integration (not a third party one)**

**Good luck!**