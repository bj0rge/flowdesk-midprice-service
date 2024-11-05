import path from "path";
import plugin from "fastify-plugin";
import autoload from "@fastify/autoload";

export default plugin(async (app) => {
  app.register(autoload, {
    dir: path.join(__dirname, "..", "routes"),
  });
});
