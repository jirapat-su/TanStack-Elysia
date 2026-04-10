import { Elysia } from "elysia";
import pkg from "../../../../package.json";
import { GetInfoResponseSchema } from "./getInfo.schema";
import { toMemoryMB } from "./getInfo.utils";

export const getInfoHandler = new Elysia({ name: "server/get-info" }).get(
  "/info",
  () => ({
    name: pkg.name,
    version: pkg.version,
    server: {
      uptime: process.uptime(),
      memoryUsage: toMemoryMB(process.memoryUsage()),
      timestamp: new Date().toISOString(),
    },
  }),
  {
    response: GetInfoResponseSchema,
    detail: {
      tags: ["Server"],
      summary: "Server information",
      description:
        "Returns server metadata including name, version, uptime, and memory usage",
    },
  },
);
