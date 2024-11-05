import { describe, it } from "node:test";
import { deepEqual } from "node:assert";
import { buildDatabase } from "../inMemoryDatabase";
import type { Exchange } from "../../domain";

describe("inMemoryDatabase", () => {
  describe("getBestOrders()", () => {
    const database = buildDatabase();
    describe("given an exchange that is not handled", () => {
      it("should return the default best orders", () => {
        deepEqual(database.getBestOrders("eToro" as unknown as Exchange), {
          bestAsk: -1,
          bestBid: -1,
        });
      });
    });

    describe("given an exchange that is handled", () => {
      it("should return the default best orders", () => {
        deepEqual(database.getBestOrders("binance"), {
          bestAsk: Infinity,
          bestBid: 0,
        });
      });
    });
  });

  describe("setBestBid()", () => {
    const database = buildDatabase();
    it("should store the best bid for an exchange", () => {
      database.setBestBid("binance", 1000);
      deepEqual(database.getBestOrders("binance"), {
        bestAsk: Infinity,
        bestBid: 1000,
      });
    });
  });

  describe("setBestAsk()", () => {
    const database = buildDatabase();
    it("should store the best ask for an exchange", () => {
      database.setBestAsk("binance", 1000);
      deepEqual(database.getBestOrders("binance"), {
        bestAsk: 1000,
        bestBid: 0,
      });
    });
  });
});
