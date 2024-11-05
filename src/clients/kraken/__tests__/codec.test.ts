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
        channel: "book",
        type: "snapshot",
        data: [
          {
            symbol: "BTC/USD",
            checksum: 123456789,
            bids: [
              { price: 0.0024, qty: 10 },
              { price: 0.0023, qty: 5 },
            ],
            asks: [
              { price: 0.0026, qty: 9 },
              { price: 0.0027, qty: 4 },
            ],
          },
        ],
      };

      const result = decodeWsResponse(data);

      deepEqual(result, {
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
        decodeRestResponse("foo")({
          bar: "baz",
        });
      });
    });
  });

  describe("when the data matches the expected schema", () => {
    // we should use generators leveraging faker, but meh
    const data = {
      error: [],
      result: {
        XBTUSDT: {
          asks: [
            ["70137.20000", "0.383", 1730826160],
            ["70146.80000", "0.301", 1730826159],
          ],
          bids: [
            ["70128.10000", "0.001", 1730826157],
            ["70118.00000", "0.024", 1730826159],
          ],
        },
      },
    };

    describe("when the pair is not in the response", () => {
      it("returns the decoded order book entries", () => {
        throws(() => {
          decodeRestResponse("foo")(data);
        });
      });
    });
    describe("when the pair is in the response", () => {
      it("returns the decoded order book entries", () => {
        const result = decodeRestResponse("XBTUSDT")(data);

        deepEqual(result, {
          bids: [
            { price: 70128.1, quantity: 0.001 },
            { price: 70118, quantity: 0.024 },
          ],
          asks: [
            { price: 70137.2, quantity: 0.383 },
            { price: 70146.8, quantity: 0.301 },
          ],
        });
      });
    });
  });
});
