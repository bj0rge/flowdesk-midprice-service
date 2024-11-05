import { throws, deepEqual } from "node:assert";
import { describe, it } from "node:test";
import { decodeRestResponse, decodeWsResponse } from "../codec";

describe("decodeWsResponse()", () => {
  describe("when the data doesn't match the expected schema", () => {
    it("throws an error", () => {
      throws(() => {
        decodeWsResponse({
          foo: "bar",
        });
      });
    });
  });

  describe("when the data matches the expected schema", () => {
    it("returns the decoded order book entries", () => {
      // we should use generators leveraging faker, but meh
      const data = {
        e: "depthUpdate",
        E: 123456789,
        s: "BTCUSDT",
        U: 157,
        u: 160,
        b: [
          ["0.0024", "10"],
          ["0.0023", "5"],
        ],
        a: [
          ["0.0026", "9"],
          ["0.0027", "4"],
        ],
      };

      const result = decodeWsResponse(data);

      deepEqual(result, {
        firstUpdateId: 157,
        lastUpdateId: 160,
        bids: [
          { price: 0.0024, quantity: 10 },
          { price: 0.0023, quantity: 5 },
        ],
        asks: [
          { price: 0.0026, quantity: 9 },
          { price: 0.0027, quantity: 4 },
        ],
      });
    });
  });
});

describe("decodeRestResponse()", () => {
  describe("when the data doesn't match the expected schema", () => {
    it("throws an error", () => {
      throws(() => {
        decodeRestResponse({
          foo: "bar",
        });
      });
    });
  });

  describe("when the data matches the expected schema", () => {
    it("returns the decoded order book entries", () => {
      // we should use generators leveraging faker, but meh
      const data = {
        lastUpdateId: 175,
        bids: [
          ["0.0025", "12"],
          ["0.0026", "13.9"],
        ],
        asks: [
          ["0.0028", "17.6"],
          ["0.0029", "0.0003"],
        ],
      };

      const result = decodeRestResponse(data);

      deepEqual(result, {
        lastUpdateId: 175,
        bids: [
          { price: 0.0025, quantity: 12 },
          { price: 0.0026, quantity: 13.9 },
        ],
        asks: [
          { price: 0.0028, quantity: 17.6 },
          { price: 0.0029, quantity: 0.0003 },
        ],
      });
    });
  });
});
