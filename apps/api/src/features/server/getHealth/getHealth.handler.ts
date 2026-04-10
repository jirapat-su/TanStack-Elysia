import { Elysia } from "elysia";
import { GetHealthResponseSchema } from "./getHealth.schema";

export const getHealthHandler = new Elysia({ name: "server/get-health" }).get(
  "/health",
  () => ({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }),
  {
    response: GetHealthResponseSchema,
    detail: {
      tags: ["Server"],
      summary: "Health check",
      description:
        "Returns the current health status of the server including uptime and timestamp",
    },
  },
);
