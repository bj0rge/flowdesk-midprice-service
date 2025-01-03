export const exchanges = ["binance", "kraken", "huobi"] as const;
export type Exchange = (typeof exchanges)[number];

export type ExchangeBestOrders = {
  bestAsk: number;
  bestBid: number;
};

export type ExchangeService = {
  startListeners: () => void;
  updateOnDemand: () => Promise<void>;
};
