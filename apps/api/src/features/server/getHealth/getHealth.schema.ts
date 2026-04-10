import { z } from "zod";

export const GetHealthResponseSchema = z.object({
  status: z.string(),
  uptime: z.number(),
  timestamp: z.string(),
});

export type GetHealthResponse = z.infer<typeof GetHealthResponseSchema>;
