import { describe, it } from "node:test";
import { deepEqual } from "node:assert";
import { updateBestOrders } from "../helpers";
import type { OrderbookEntries } from "../../../domain";
import { buildBestOrdersService } from "../../bestOrdersService";
import { buildDatabase } from "../../../infrastructure";
import { mockLogger } from "../../../__tests__/utils/mocks/logger";

describe("updateBestOrders()", () => {
  describe("given a list of asks and bids", () => {
    describe('with better asks and bids than the current "best" orders', () => {
      // This should be a mock but it's also a tech test
      const binanceDatabase = buildDatabase();
      const binanceBestOrdersService = buildBestOrdersService({
        assets: { baseAsset: "BTC", quoteAsset: "USDT" },
        database: binanceDatabase,
        logger: mockLogger,
      });

      it("should update the best ask and best bid", () => {
        const entries: OrderbookEntries = {
          asks: [
            { price: 100, quantity: 1 },
            { price: 200, quantity: 2 },
            { price: 300, quantity: 3 },
          ],
          bids: [
            { price: 10, quantity: 1 },
            { price: 20, quantity: 2 },
            { price: 30, quantity: 3 },
          ],
        };

        updateBestOrders({
          bestOrdersService: binanceBestOrdersService,
          entries,
          exchange: "binance",
        });
        deepEqual(binanceDatabase.getBestOrders("binance"), {
          bestAsk: 100,
          bestBid: 30,
        });
      });
    });

    describe('with worse asks and bids than the current "best" orders', () => {
      // This should be a mock but it's also a tech test
      const krakenDatabase = buildDatabase();
      const krakenBestOrdersService = buildBestOrdersService({
        assets: { baseAsset: "BTC", quoteAsset: "USDT" },
        database: krakenDatabase,
        logger: mockLogger,
      });
      krakenBestOrdersService.setBestAsk("kraken", 1000);
      krakenBestOrdersService.setBestBid("kraken", 1000);

      it("should not update the best ask and best bid", () => {
        const entries: OrderbookEntries = {
          asks: [
            { price: 2000, quantity: 1 },
            { price: 3000, quantity: 2 },
            { price: 4000, quantity: 3 },
          ],
          bids: [
            { price: 100, quantity: 1 },
            { price: 200, quantity: 2 },
            { price: 300, quantity: 3 },
          ],
        };

        updateBestOrders({
          bestOrdersService: krakenBestOrdersService,
          entries,
          exchange: "kraken",
        });
        deepEqual(krakenDatabase.getBestOrders("kraken"), {
          bestAsk: 1000,
          bestBid: 1000,
        });
      });
    });
  });
});
