import { type Exchange, type ExchangeBestOrders, exchanges } from "../domain";

const DEFAULT_BEST_ORDERS: ExchangeBestOrders = {
  bestAsk: Infinity,
  bestBid: 0,
};

export type Database = {
  getAllBestOrders: () => { [key in Exchange]: ExchangeBestOrders };
  getBestOrders: (exchange: Exchange) => ExchangeBestOrders;
  setBestBid: (exchange: Exchange, bestBid: number) => void;
  setBestAsk: (exchange: Exchange, bestAsk: number) => void;
};

export const buildDatabase = (): Database => {
  const bestOrderByExchange: Map<Exchange, ExchangeBestOrders> = new Map(
    exchanges.flatMap((exchange) => [[exchange, DEFAULT_BEST_ORDERS]])
  );

  const getAllBestOrders: Database["getAllBestOrders"] = () => {
    return Object.fromEntries(bestOrderByExchange.entries()) as {
      [key in Exchange]: ExchangeBestOrders;
    };
  };

  const getBestOrders: Database["getBestOrders"] = (exchange) =>
    bestOrderByExchange.get(exchange) ?? {
      bestAsk: -1,
      bestBid: -1,
    };

  const setBestBid: Database["setBestAsk"] = (exchange, bestBid) => {
    const bestOrders = getBestOrders(exchange);
    bestOrderByExchange.set(exchange, { ...bestOrders, bestBid });
  };

  const setBestAsk: Database["setBestBid"] = (exchange, bestAsk) => {
    const bestOrders = getBestOrders(exchange);
    bestOrderByExchange.set(exchange, { ...bestOrders, bestAsk });
  };

  return {
    getAllBestOrders,
    getBestOrders,
    setBestBid,
    setBestAsk,
  };
};
