import { mock } from "node:test";
import type { FastifyBaseLogger } from "fastify";

export const mockLogger: FastifyBaseLogger = {
  debug: mock.fn(),
  info: mock.fn(),
  warn: mock.fn(),
  error: mock.fn(),
  fatal: mock.fn(),
} as unknown as FastifyBaseLogger;
