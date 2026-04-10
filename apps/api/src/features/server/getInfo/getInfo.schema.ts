import { z } from "zod";

const MemoryUsageSchema = z.object({
  rss: z.number(),
  heapTotal: z.number(),
  heapUsed: z.number(),
  external: z.number(),
  arrayBuffers: z.number(),
});

export const GetInfoResponseSchema = z.object({
  name: z.string(),
  version: z.string(),
  server: z.object({
    uptime: z.number(),
    memoryUsage: MemoryUsageSchema,
    timestamp: z.string(),
  }),
});

export type GetInfoResponse = z.infer<typeof GetInfoResponseSchema>;
