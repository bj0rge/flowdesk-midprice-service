import Config from "config";
import { configSchema, type Config as SafeConfig } from "./schema";

export const getConfig = (): SafeConfig => {
  const rawConfig = Config.util.toObject();
  const config = configSchema.parse(rawConfig);
  return config;
};
