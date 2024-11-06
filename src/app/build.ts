import Fastify, {
  type FastifyInstance,
  type FastifyServerOptions,
} from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { getConfig } from "../utils";
import { plugins } from "../presentation";
import { startServices } from "./startServices";

const envToLogger: {
  development: FastifyServerOptions["logger"];
  production: FastifyServerOptions["logger"];
  test: FastifyServerOptions["logger"];
} = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
};

export async function build(): Promise<FastifyInstance> {
  const { env } = getConfig();

  const app = Fastify({ logger: envToLogger[env] ?? true });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(plugins);

  startServices({ logger: app.log });

  return app.withTypeProvider<ZodTypeProvider>();
}
