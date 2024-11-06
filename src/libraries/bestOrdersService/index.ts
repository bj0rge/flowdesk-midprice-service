import type { FastifyBaseLogger } from "fastify";
import type { Assets, Exchange, ExchangeBestOrders } from "../../domain";
import type { Database } from "../../infrastructure";

export type Dependencies = {
  database: Database;
  assets: Assets;
  logger: FastifyBaseLogger;
};

export type BestOrdersService = {
  setBestAsk: (exchange: Exchange, bestAsk: number) => void;
  setBestBid: (exchange: Exchange, bestBid: number) => void;
  getMidPrice: (exchange: Exchange) => number;
  getGlobalPriceIndex: () => number;
};

export function buildBestOrdersService({
  database: db,
  assets,
  logger,
}: Dependencies): BestOrdersService {
  const setBestAsk: BestOrdersService["setBestAsk"] = (exchange, bestAsk) => {
    // For the sake of this test this is enough, but ideally we should
    // use transaction and lock the table in order to avoid concurrency issues
    const currentBestAsk = db.getBestOrders(exchange).bestAsk;
    if (bestAsk < currentBestAsk) {
      db.setBestAsk(exchange, bestAsk);
      logger.info({ exchange, assets, bestAsk }, "New best ask");
    }
  };

  const setBestBid: BestOrdersService["setBestBid"] = (exchange, bestBid) => {
    // For the sake of this test this is enough, but ideally we should
    // use transaction and lock the table in order to avoid concurrency issues
    const currentBestBid = db.getBestOrders(exchange).bestBid;
    if (bestBid > currentBestBid) {
      db.setBestBid(exchange, bestBid);
      logger.info({ exchange, assets, bestBid }, "New best bid");
    }
  };

  const getMidPrice: BestOrdersService["getMidPrice"] = (exchange) => {
    const bestOrders = db.getBestOrders(exchange);
    return computeMidPrice(bestOrders);
  };

  const getGlobalPriceIndex: BestOrdersService["getGlobalPriceIndex"] = () => {
    const allBestOrders = db.getAllBestOrders();
    const midPrices = Object.values(allBestOrders).map(computeMidPrice);
    return (
      midPrices.reduce((acc, currMidPrice) => acc + currMidPrice, 0) /
      midPrices.length
    );
  };

  return {
    setBestAsk,
    setBestBid,
    getMidPrice,
    getGlobalPriceIndex,
  };
}

export const computeMidPrice = (bestOrders: ExchangeBestOrders): number => {
  return (bestOrders.bestAsk + bestOrders.bestBid) / 2;
};
