import { Elysia } from "elysia";
import { getHealthHandler } from "./getHealth/getHealth.handler";
import { getInfoHandler } from "./getInfo/getInfo.handler";

export const serverRouter = new Elysia({
  name: "server",
  prefix: "/server",
})
  .use(getHealthHandler)
  .use(getInfoHandler);
