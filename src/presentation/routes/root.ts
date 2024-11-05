import * as z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { defaultErrorsSchema } from "../utils/errors";

const okStatusSchema = z.object({
  status: z.literal("ok"),
});

const schema = {
  summary: "Get status",
  response: {
    200: okStatusSchema,
    ...defaultErrorsSchema,
  },
} as const;

export default async (app: FastifyInstance) =>
  app.withTypeProvider<ZodTypeProvider>().get("/", { schema }, () => {
    return { status: "ok" as const };
  });
