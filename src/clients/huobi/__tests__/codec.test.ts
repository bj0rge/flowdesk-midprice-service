import { throws, deepEqual } from "node:assert";
import { describe, it } from "node:test";
import { decodeRestResponse } from "../codec";

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
        ch: "market.btcusdt.depth.step0",
        status: "ok",
        ts: 1730832097487,
        tick: {
          bids: [
            [70103.21, 0.86514],
            [70102.74, 0.566229],
          ],
          asks: [
            [70103.22, 0.0109049161774821],
            [70103.23, 0.002],
          ],
          version: 174404799331,
          ts: 1730832096802,
        },
      };

      const result = decodeRestResponse(data);

      deepEqual(result, {
        lastUpdateId: 1730832097487,
        bids: [
          { price: 70103.21, quantity: 0.86514 },
          { price: 70102.74, quantity: 0.566229 },
        ],
        asks: [
          { price: 70103.22, quantity: 0.0109049161774821 },
          { price: 70103.23, quantity: 0.002 },
        ],
      });
    });
  });
});
