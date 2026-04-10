import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const envVars = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, envVars);

  return {
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      paraglideVitePlugin({
        project: "./project.inlang",
        outdir: "./src/paraglide",
        strategy: ["cookie", "baseLocale"],
      }),
      devtools(),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
      nitro({
        preset: "bun",
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
