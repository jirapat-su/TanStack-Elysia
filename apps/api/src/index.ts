import cors from "@elysiajs/cors";
import { fromTypes, openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import z from "zod";
import * as packageJson from "../package.json";
import { router } from "./features/router";

const app = new Elysia({ name: "api" })
  .use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(router)
  .use(
    openapi({
      mapJsonSchema: {
        zod: z.toJSONSchema,
      },
      documentation: {
        info: {
          title: "API Documentation",
          version: packageJson.version,
          description: "API documentation",
        },
      },
      path: "/docs",
      provider: "scalar",
      references: fromTypes("src/index.ts"),
      specPath: "/docs/json",
      enabled: true,
      exclude: {
        methods: ["all", "options", "head"],
      },
    }),
  );

export type App = typeof app;

export default app.compile();
