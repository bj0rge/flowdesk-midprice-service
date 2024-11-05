import z from "zod";

const baseUrlSchema = z.object({ baseUrl: z.string() });

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
    binance: z.object({
      websocket: baseUrlSchema,
      rest: baseUrlSchema,
    }),
  }),
});

export type Config = z.infer<typeof configSchema>;
