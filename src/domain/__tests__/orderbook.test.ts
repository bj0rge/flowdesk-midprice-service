import { describe, it } from "node:test";
import { deepEqual } from "node:assert";
import {
  findBestAsk,
  findBestBid,
  findBestOrders,
  type OrderbookEntries,
} from "../orderbook";

describe("findBestAsk()", () => {
  it("should return the lower ask", () => {
    const asks = [1, 2, 3];
    const bestAsk = findBestAsk(asks);
    deepEqual(bestAsk, 1);
  });
});

describe("findBestBid()", () => {
  it("should return the higher bid", () => {
    const bids = [1, 2, 3];
    const bestBid = findBestBid(bids);
    deepEqual(bestBid, 3);
  });
});

describe("findBestOrders()", () => {
  it("should return the best ask and best bid", () => {
    const entries: OrderbookEntries = {
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
    };

    const bestOrders = findBestOrders(entries);
    deepEqual(bestOrders, {
      bestAsk: 0.0026,
      bestBid: 0.0024,
    });
  });
});
