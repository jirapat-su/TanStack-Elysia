import { treaty } from "@elysiajs/eden";
import type { App } from "api/src/index";

export const createApiClient = (baseUrl: string) => treaty<App>(baseUrl);

export type ApiClient = ReturnType<typeof createApiClient>;
