import z from "zod";

const baseUrlSchema = z.object({ baseUrl: z.string() });
const clientSchema = z.object({
  websocket: baseUrlSchema,
  rest: baseUrlSchema,
});

export const configSchema = z.object({
  env: z.union([z.literal("development"), z.literal("test")]),
  app: z
    .object({
      host: z.string(),
      port: z.number(),
    })
    .strict(),
  service: z.object({
    globalPriceIndex: z.object({ handledCryptos: z.array(z.string()).min(2) }),
  }),
  clients: z.object({
    binance: clientSchema,
    kraken: clientSchema,
  }),
});

export type Config = z.infer<typeof configSchema>;
