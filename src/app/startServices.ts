import type { FastifyBaseLogger } from "fastify";
import { globalPriceIndexService } from "../libraries";
import { type Assets, supportedPairs } from "../domain";

export const startServices = ({
  logger,
}: {
  logger: FastifyBaseLogger;
}): void => {
  const supportedAssets = supportedPairs.map((pair) => pair.split("/"));
  const assets: Assets[] = supportedAssets.map((supportedAsset) => ({
    baseAsset: supportedAsset[0] || "",
    quoteAsset: supportedAsset[1] || "",
  }));
  for (const asset of assets) {
    globalPriceIndexService.startService(asset, logger);
  }
};
