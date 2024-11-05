import z from "zod";
import type { Order, OrderbookEntries, Crypto } from "../../types";

const orderSchema = z.tuple([z.string(), z.string()]);

const decodeWsOrder = (data: unknown): Order => {
  const parsedOrder = orderSchema.parse(data);
  return {
    price: parseFloat(parsedOrder[0]),
    quantity: parseFloat(parsedOrder[1]),
  };
};

const orderbookWsResponseSchema = z.object({
  e: z.literal("depthUpdate"),
  E: z.number(),
  s: z.string(),
  U: z.number(),
  u: z.number(),
  b: z.array(orderSchema),
  a: z.array(orderSchema),
});

export const decodeWsResponse = (data: unknown): OrderbookEntries => {
  const response = orderbookWsResponseSchema.parse(data);
  return {
    firstUpdateId: response.U,
    lastUpdateId: response.u,
    bids: response.b.map(decodeWsOrder),
    asks: response.a.map(decodeWsOrder),
  };
};

const orderbookRestResponseSchema = z.object({
  lastUpdateId: z.number(),
  bids: z.array(orderSchema),
  asks: z.array(orderSchema),
});

export const decodeRestResponse = (data: unknown): OrderbookEntries => {
  const response = orderbookRestResponseSchema.parse(data);
  return {
    lastUpdateId: response.lastUpdateId,
    bids: response.bids.map(decodeWsOrder),
    asks: response.asks.map(decodeWsOrder),
  };
};

export const encodeCrypto = (crypto: Crypto): string => crypto.toLowerCase();
