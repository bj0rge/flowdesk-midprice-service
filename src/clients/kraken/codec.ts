import z from "zod";
import type { Crypto, Order, OrderbookEntries } from "../../domain";

const wsOrderSchema = z.object({
  price: z.number(),
  qty: z.number(),
});

const decodeWsOrder = (data: unknown): Order => {
  const parsedOrder = wsOrderSchema.parse(data);
  return {
    price: parsedOrder.price,
    quantity: parsedOrder.qty,
  };
};

const orderbookWsResponseSchema = z.object({
  channel: z.literal("book"),
  type: z.union([z.literal("snapshot"), z.literal("update")]),
  data: z
    .array(
      z.object({
        symbol: z.string(),
        checksum: z.number(),
        bids: z.array(wsOrderSchema),
        asks: z.array(wsOrderSchema),
      })
    )
    .length(1),
});

export const decodeWsResponse = (data: unknown): OrderbookEntries => {
  const response = orderbookWsResponseSchema.parse(data);
  return {
    bids: response.data[0]?.bids.map(decodeWsOrder) ?? [],
    asks: response.data[0]?.asks.map(decodeWsOrder) ?? [],
  };
};

const restOrderSchema = z.tuple([z.string(), z.string(), z.number()]);
const decodeRestOrder = (data: unknown): Order => {
  const parsedOrder = restOrderSchema.parse(data);
  return {
    price: parseFloat(parsedOrder[0]),
    quantity: parseFloat(parsedOrder[1]),
  };
};

const orderbookRestResponseSchema = z.object({
  error: z.array(z.never()).length(0),
  result: z.record(
    z.string(),
    z.object({
      asks: z.array(restOrderSchema),
      bids: z.array(restOrderSchema),
    })
  ),
});

export const decodeRestResponse =
  (pair: string) =>
  (data: unknown): OrderbookEntries => {
    const response = orderbookRestResponseSchema.parse(data);
    const orderbook = response.result[pair];
    if (!orderbook) {
      // TODO: this should happend, but it should be handled in a better way
      throw new Error(`Invalid pair: ${pair}`);
    }
    return {
      bids: orderbook.bids.map(decodeRestOrder),
      asks: orderbook.asks.map(decodeRestOrder),
    };
  };

export const encodeCryptoForWs = (crypto: Crypto): string => {
  switch (crypto) {
    case "BTC":
    case "USDT":
      return crypto;
    default:
      throw new Error("Invalid crypto");
  }
};

export const encodeCryptoForRest = (crypto: Crypto): string => {
  switch (crypto) {
    case "BTC":
      return `XBT`;
    case "USDT":
      return crypto;
    default:
      throw new Error("Invalid crypto");
  }
};
