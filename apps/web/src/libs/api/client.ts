import { createApiClient } from "@repo/eden";
import { env } from "@/env";

export const api = createApiClient(env.VITE_API_URL);
