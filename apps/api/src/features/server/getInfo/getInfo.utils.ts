const BYTES_PER_MB = 1024 * 1024;

export const toMemoryMB = (memoryUsage: NodeJS.MemoryUsage) => ({
  rss: Math.round((memoryUsage.rss / BYTES_PER_MB) * 100) / 100,
  heapTotal: Math.round((memoryUsage.heapTotal / BYTES_PER_MB) * 100) / 100,
  heapUsed: Math.round((memoryUsage.heapUsed / BYTES_PER_MB) * 100) / 100,
  external: Math.round((memoryUsage.external / BYTES_PER_MB) * 100) / 100,
  arrayBuffers:
    Math.round((memoryUsage.arrayBuffers / BYTES_PER_MB) * 100) / 100,
});
