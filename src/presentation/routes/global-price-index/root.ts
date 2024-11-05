import * as z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { defaultErrorsSchema } from "../../utils/errors";
import { getConfig } from "../../../utils";
import {
  getDepthOrderbookSnapshot,
  listenOrderbook,
} from "../../../clients/kraken";

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
    ...defaultErrorsSchema,
  },
} as const;

export default async (app: FastifyInstance) =>
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/:baseAsset/:quoteAsset", { schema }, async (request) => {
      const { baseAsset, quoteAsset } = request.params;

      // test only
      listenOrderbook({
        assets: { baseAsset, quoteAsset },
        cb: (entries) => {
          console.log({ entries });
        },
      });
      const res = await getDepthOrderbookSnapshot({
        assets: { baseAsset, quoteAsset },
      });
      console.log(res);
      return { globalPriceIndex: 333 };
    });
