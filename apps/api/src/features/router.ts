import { Elysia } from "elysia";
import { serverRouter } from "./server/server.router";

export const router = new Elysia({ name: "router" }).use(serverRouter);
