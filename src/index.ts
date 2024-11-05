import { exit } from "node:process";
import console from "node:console";
import { build } from "./app";
import { getConfig } from "./utils/config";

const start = async () => {
  try {
    const server = await build();
    const {
      app: { host, port },
    } = getConfig();

    await server.listen({ port, host });
  } catch (error: unknown) {
    console.error("Fatal error on build", error);
    exit();
  }
};

start();
