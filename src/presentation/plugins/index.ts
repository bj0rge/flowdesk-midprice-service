import plugin from "fastify-plugin";
import routes from "./routes";
import errors from "./errors";

export default plugin(async (app) => {
  app.register(routes);
  app.register(errors);
});
