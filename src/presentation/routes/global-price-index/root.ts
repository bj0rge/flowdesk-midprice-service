import * as z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { defaultErrorsSchema } from "../../utils/errors";
import { getConfig } from "../../../utils";
import { isSupportedPair, supportedPairs } from "../../../domain";
import { globalPriceIndexService } from "../../../libraries";

const {
  service: { globalPriceIndex: config },
} = getConfig();

const responseSchema = z.object({
  globalPriceIndex: z.number(),
});

const assetSchema =
  // forcing type as the zod schema is z.array(z.string()).min(2)
  config.handledCryptos.map((crypto) => z.literal(crypto)) as [
    z.ZodLiteral<string>,
    z.ZodLiteral<string>,
    ...z.ZodLiteral<string>[]
  ];

const paramsSchema = z.object({
  baseAsset: z.union(assetSchema),
  quoteAsset: z.union(assetSchema),
});

const schema = {
  summary: "Get global price index for a pair of assets",
  params: paramsSchema,
  response: {
    200: responseSchema,
    403: z.object({
      error: z.string(),
      message: z.string(),
    }),
    ...defaultErrorsSchema,
  },
} as const;

export default async (app: FastifyInstance) =>
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/:baseAsset/:quoteAsset", { schema }, async (request, reply) => {
      const assets = request.params;

      if (!isSupportedPair(assets)) {
        return reply.code(403).send({
          error: "unsupportedPair",
          message: `Pair ${assets.baseAsset}/${
            assets.quoteAsset
          } is not supported. Please try with one of the following pairs: ${supportedPairs.join(
            ", "
          )}`,
        });
      }

      // Updating in order to have the most recent global price index
      // But it should already be up to date
      await globalPriceIndexService.updateOnDemand(assets, app.log);
      const globalPriceIndex = globalPriceIndexService.getGlobalPriceIndex(
        assets,
        app.log
      );
      return { globalPriceIndex };
    });
