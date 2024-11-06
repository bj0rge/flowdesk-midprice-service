import type { FastifyBaseLogger } from "fastify";
import { binance } from "../../../clients";
import { isSupportedPair, type Assets } from "../../../domain";
import type { BestOrdersService } from "../../bestOrdersService";
import { updateBestOrders } from "../helpers";

type Dependancies = {
  bestOrdersService: BestOrdersService;
  assets: Assets;
  logger: FastifyBaseLogger;
};

export type BinanceService = {
  startListeners: () => void;
  updateOnDemand: () => Promise<void>;
};

export const buildBinanceService = ({
  bestOrdersService,
  assets,
  logger,
}: Dependancies): BinanceService => {
  if (!isSupportedPair(assets)) {
    logger.error({ assets }, "Unsupported pair");
    throw new Error("Unsupported pair");
  }
  const webhookHandler = (): void => {
    binance.listenOrderbook({
      assets,
      cb: (entries) => {
        updateBestOrders({ bestOrdersService, entries, exchange: "binance" });
      },
    });
  };

  const restHandler = async (): Promise<void> => {
    const entries = await binance.getDepthOrderbookSnapshot({
      assets,
    });
    updateBestOrders({ bestOrdersService, entries, exchange: "binance" });
  };

  const startListeners: BinanceService["startListeners"] = async () => {
    webhookHandler();
    setInterval(restHandler, 1000);
  };

  const updateOnDemand: BinanceService["updateOnDemand"] = async () => {
    await restHandler();
  };

  return {
    startListeners,
    updateOnDemand,
  };
};
