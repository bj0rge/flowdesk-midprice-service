import type { ExchangeBestOrders } from "./exchange";

export type Order = {
  price: number;
  quantity: number;
};

export type OrderbookEntries = {
  firstUpdateId?: number;
  lastUpdateId?: number;
  bids: Order[];
  asks: Order[];
};

// Adding helpers not to mess with whether min or max is considered as best
export const findBestAsk = (asks: number[]): number => {
  return Math.min(...asks);
};
export const findBestBid = (bids: number[]): number => {
  return Math.max(...bids);
};

export const findBestOrders = (
  entries: OrderbookEntries
): ExchangeBestOrders => {
  return {
    bestAsk: findBestAsk(entries.asks.map((entry) => entry.price)),
    bestBid: findBestBid(entries.bids.map((entry) => entry.price)),
  };
};
