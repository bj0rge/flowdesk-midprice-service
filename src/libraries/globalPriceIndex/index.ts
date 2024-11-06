import type { FastifyBaseLogger } from "fastify";
import {
  isSupportedPair,
  exchanges,
  type Exchange,
  type ExchangeService,
  type Assets,
  type SupportedPair,
} from "../../domain";
import {
  buildBestOrdersService,
  type BestOrdersService,
} from "../bestOrdersService";
import { buildDatabase } from "../../infrastructure";
import {
  buildBinanceService,
  buildHuobiService,
  buildKrakenService,
} from "../exchanges";

type ExchangeServices = {
  [exchange in Exchange]: ExchangeService;
};

const serviceBuilderByExchange: {
  [exchange in Exchange]: ({
    bestOrdersService,
    assets,
    logger,
  }: {
    bestOrdersService: BestOrdersService;
    assets: Assets;
    logger: FastifyBaseLogger;
  }) => ExchangeService;
} = {
  binance: buildBinanceService,
  huobi: buildHuobiService,
  kraken: buildKrakenService,
};

type GlobalPriceIndexService = {
  startService: (assets: Assets, logger: FastifyBaseLogger) => void;
  updateOnDemand: (assets: Assets, logger: FastifyBaseLogger) => Promise<void>;
  getGlobalPriceIndex: (assets: Assets, logger: FastifyBaseLogger) => number;
};

const servicesByPair: Map<
  SupportedPair,
  { bestOrdersService: BestOrdersService; exchangeServices: ExchangeServices }
> = new Map();

const startService: GlobalPriceIndexService["startService"] = (
  assets,
  logger
) => {
  if (!isSupportedPair(assets)) {
    logger.error({ assets }, "Unsupported pair");
  }

  const pair = `${assets.baseAsset}/${assets.quoteAsset}` as SupportedPair;

  // do not start service if it is already running
  if (servicesByPair.get(pair)) {
    return;
  }
  const database = buildDatabase();
  const bestOrdersService = buildBestOrdersService({
    assets,
    logger,
    database,
  });

  const exchangeServices: ExchangeServices = exchanges.reduce(
    (acc, exchange) => ({
      ...acc,
      [exchange]: serviceBuilderByExchange[exchange]({
        bestOrdersService,
        assets,
        logger,
      }),
    }),
    {} as ExchangeServices
  );

  servicesByPair.set(pair, { bestOrdersService, exchangeServices });

  for (const service of Object.values(exchangeServices)) {
    service.startListeners();
  }
};

const updateOnDemand: GlobalPriceIndexService["updateOnDemand"] = async (
  assets,
  logger
) => {
  if (!isSupportedPair(assets)) {
    logger.error({ assets }, "Unsupported pair");
  }

  const pair = `${assets.baseAsset}/${assets.quoteAsset}` as SupportedPair;

  const exchangeServices = servicesByPair.get(pair);
  if (!exchangeServices) {
    logger.error({ assets }, "Service not started, this shouldn't happen");
    return;
  }

  for (const service of Object.values(exchangeServices.exchangeServices)) {
    await service.updateOnDemand();
  }
};

const getGlobalPriceIndex: GlobalPriceIndexService["getGlobalPriceIndex"] = (
  assets,
  logger
) => {
  if (!isSupportedPair(assets)) {
    logger.error({ assets }, "Unsupported pair");
  }

  const pair = `${assets.baseAsset}/${assets.quoteAsset}` as SupportedPair;

  const exchangeServices = servicesByPair.get(pair);
  if (!exchangeServices) {
    logger.error({ assets }, "Service not started, this shouldn't happen");
    // This should be an outcome, not 0
    return 0;
  }

  const globalPriceIndex =
    exchangeServices.bestOrdersService.getGlobalPriceIndex();
  return globalPriceIndex;
};

export const globalPriceIndexService: GlobalPriceIndexService = {
  startService,
  updateOnDemand,
  getGlobalPriceIndex,
};
