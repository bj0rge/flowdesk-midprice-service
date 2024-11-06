import type { FastifyBaseLogger } from "fastify";
import { kraken } from "../../../clients";
import { isSupportedPair, type Assets } from "../../../domain";
import type { BestOrdersService } from "../../bestOrdersService";
import { updateBestOrders } from "../helpers";

type Dependancies = {
  bestOrdersService: BestOrdersService;
  assets: Assets;
  logger: FastifyBaseLogger;
};

export type KrakenService = {
  startListeners: () => void;
  updateOnDemand: () => Promise<void>;
};

export const buildKrakenService = ({
  bestOrdersService,
  assets,
  logger,
}: Dependancies): KrakenService => {
  if (!isSupportedPair(assets)) {
    logger.error({ assets }, "Unsupported pair");
    throw new Error("Unsupported pair");
  }
  const webhookHandler = (): void => {
    kraken.listenOrderbook({
      assets,
      cb: (entries) => {
        updateBestOrders({ bestOrdersService, entries, exchange: "kraken" });
      },
    });
  };

  const restHandler = async (): Promise<void> => {
    const entries = await kraken.getDepthOrderbookSnapshot({
      assets,
    });
    updateBestOrders({ bestOrdersService, entries, exchange: "kraken" });
  };

  const startListeners: KrakenService["startListeners"] = async () => {
    webhookHandler();
    setInterval(restHandler, 1000);
  };

  const updateOnDemand: KrakenService["updateOnDemand"] = async () => {
    await restHandler();
  };

  return {
    startListeners,
    updateOnDemand,
  };
};
