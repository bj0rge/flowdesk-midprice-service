import z from "zod";
import type { Crypto, Order, OrderbookEntries } from "../../types";

const restOrderSchema = z.tuple([z.number(), z.number()]);
const decodeRestOrder = (data: unknown): Order => {
  const parsedOrder = restOrderSchema.parse(data);
  return {
    price: parsedOrder[0],
    quantity: parsedOrder[1],
  };
};

const orderbookRestResponseSchema = z.object({
  status: z.literal("ok"),
  ts: z.number(),
  tick: z.object({
    asks: z.array(restOrderSchema),
    bids: z.array(restOrderSchema),
  }),
});

export const decodeRestResponse = (data: unknown): OrderbookEntries => {
  const response = orderbookRestResponseSchema.parse(data);
  return {
    lastUpdateId: response.ts,
    bids: response.tick.bids.map(decodeRestOrder),
    asks: response.tick.asks.map(decodeRestOrder),
  };
};

export const encodeCryptoForRest = (crypto: Crypto): string => {
  switch (crypto) {
    case "BTC":
    case "USDT":
      return crypto.toLowerCase();
    default:
      throw new Error("Invalid crypto");
  }
};
