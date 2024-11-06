import type { FastifyBaseLogger } from "fastify";
import { huobi } from "../../../clients";
import { isSupportedPair, type Assets } from "../../../domain";
import type { BestOrdersService } from "../../bestOrdersService";
import { updateBestOrders } from "../helpers";

type Dependancies = {
  bestOrdersService: BestOrdersService;
  assets: Assets;
  logger: FastifyBaseLogger;
};

export type HuobiService = {
  startListeners: () => void;
  updateOnDemand: () => Promise<void>;
};

export const buildHuobiService = ({
  bestOrdersService,
  assets,
  logger,
}: Dependancies): HuobiService => {
  if (!isSupportedPair(assets)) {
    logger.error({ assets }, "Unsupported pair");
    throw new Error("Unsupported pair");
  }
  const restHandler = async (): Promise<void> => {
    const entries = await huobi.getDepthOrderbookSnapshot({
      assets,
    });
    updateBestOrders({ bestOrdersService, entries, exchange: "huobi" });
  };

  const startListeners: HuobiService["startListeners"] = async () => {
    setInterval(restHandler, 1000);
  };

  const updateOnDemand: HuobiService["updateOnDemand"] = async () => {
    await restHandler();
  };

  return {
    startListeners,
    updateOnDemand,
  };
};
