import { describe, it } from "node:test";
import { deepEqual } from "node:assert";
import { buildDatabase } from "../../../infrastructure";
import {
  buildBestOrdersService,
  computeMidPrice,
} from "../../bestOrdersService";
import type { ExchangeBestOrders } from "../../../domain";
import { mockLogger } from "../../../__tests__/utils/mocks/logger";

const assets = { baseAsset: "BTC", quoteAsset: "USDT" };

describe("computeMidPrice()", () => {
  it("should return the average of the best bid and best ask", () => {
    const bestOrders: ExchangeBestOrders = {
      bestAsk: 100,
      bestBid: 200,
    };
    const midPrice = computeMidPrice(bestOrders);
    deepEqual(midPrice, 150);
  });
});

describe("bestOrdersService", () => {
  describe("setBestAsk()", () => {
    describe("given a best ask that is lower than the current best ask", () => {
      const db = buildDatabase();
      const service = buildBestOrdersService({
        database: db,
        logger: mockLogger,
        assets,
      });
      db.setBestAsk("binance", 1000);

      it("should update the best ask", () => {
        service.setBestAsk("binance", 50);
        deepEqual(db.getBestOrders("binance"), { bestAsk: 50, bestBid: 0 });
      });
    });

    describe("given a best ask that is higher than the current best ask", () => {
      const db = buildDatabase();
      const service = buildBestOrdersService({
        database: db,
        logger: mockLogger,
        assets,
      });
      db.setBestAsk("binance", 50);

      it("should not update the best ask", () => {
        service.setBestAsk("binance", 1000);
        deepEqual(db.getBestOrders("binance"), { bestAsk: 50, bestBid: 0 });
      });
    });
  });

  describe("setBestBid()", () => {
    describe("given a best bid that is higher than the current best bid", () => {
      const db = buildDatabase();
      const service = buildBestOrdersService({
        database: db,
        logger: mockLogger,
        assets,
      });
      db.setBestBid("binance", 50);

      it("should update the best bid", () => {
        service.setBestBid("binance", 1000);
        deepEqual(db.getBestOrders("binance"), {
          bestAsk: Infinity,
          bestBid: 1000,
        });
      });
    });

    describe("given a best bid that is lower than the current best bid", () => {
      const db = buildDatabase();
      const service = buildBestOrdersService({
        database: db,
        logger: mockLogger,
        assets,
      });
      db.setBestBid("binance", 1000);

      it("should not update the best bid", () => {
        service.setBestBid("binance", 50);
        deepEqual(db.getBestOrders("binance"), {
          bestAsk: Infinity,
          bestBid: 1000,
        });
      });
    });
  });

  describe("getMidPrice()", () => {
    const db = buildDatabase();
    const service = buildBestOrdersService({
      database: db,
      logger: mockLogger,
      assets,
    });
    db.setBestAsk("binance", 100);
    db.setBestBid("binance", 200);

    it("should return the mid price", () => {
      const midPrice = service.getMidPrice("binance");
      deepEqual(midPrice, 150);
    });
  });

  describe("getGlobalPriceIndex()", () => {
    const db = buildDatabase();
    const service = buildBestOrdersService({
      database: db,
      logger: mockLogger,
      assets,
    });
    // This won't scale if we add a lot of exchanges, but it's fine for now
    // In the future we should mock the list of exchanges
    db.setBestAsk("binance", 100);
    db.setBestBid("binance", 200);
    db.setBestAsk("kraken", 50);
    db.setBestBid("kraken", 150);
    db.setBestAsk("huobi", 100);
    db.setBestBid("huobi", 150);

    it("should return the average of the mid prices", () => {
      const globalPriceIndex = service.getGlobalPriceIndex();
      deepEqual(globalPriceIndex, 125);
    });
  });
});
