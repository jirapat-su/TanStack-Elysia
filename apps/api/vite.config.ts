import path from "node:path";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig(({ mode }) => {
  const envVars = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, envVars);

  return {
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      dts({
        outDir: "dist/types",
        include: path.join(process.cwd(), "src", "index.ts"),
      }),
      nitro({
        preset: "bun",
        serverEntry: "./src/index.ts",
        output: {
          dir: "./dist",
          serverDir: "./dist/server",
          publicDir: "./dist/public",
        },
        rollupConfig: {
          external: [],
        },
      }),
    ],
  };
});
