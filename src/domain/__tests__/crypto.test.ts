import { describe, it } from "node:test";
import { equal } from "node:assert";
import { isSupportedPair, type Assets } from "../crypto";

describe("isSupportedPair()", () => {
  describe("given a pair that is supported", () => {
    it("should return true", () => {
      const pair: Assets = { baseAsset: "BTC", quoteAsset: "USDT" };
      equal(isSupportedPair(pair), true);
    });
  });

  describe("given a pair that is not supported", () => {
    it("should return false", () => {
      const pair: Assets = { baseAsset: "EUR", quoteAsset: "USD" };
      equal(isSupportedPair(pair), false);
    });
  });
});
