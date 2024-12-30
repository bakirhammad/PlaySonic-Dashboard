import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import plugin from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [plugin()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src/", import.meta.url)),
      },
      {
        find: "@app",
        replacement: fileURLToPath(new URL("./src/app", import.meta.url)),
      },
      {
        find: "@domain",
        replacement: fileURLToPath(new URL("./src/domain", import.meta.url)),
      },
      {
        find: "@url",
        replacement: fileURLToPath(
          new URL("./src/domain/enums/URL/index.ts", import.meta.url)
        ),
      },
      {
        find: "@infrastructure",
        replacement: fileURLToPath(
          new URL("./src/infrastructure", import.meta.url)
        ),
      },
      {
        find: "@presentation",
        replacement: fileURLToPath(
          new URL("./src/presentation", import.meta.url)
        ),
      },
      {
        find: "@main",
        replacement: fileURLToPath(new URL("./src/main", import.meta.url)),
      },
      {
        find: "@assets",
        replacement: fileURLToPath(new URL("./src/assets", import.meta.url)),
      },
      {
        find: "@components",
        replacement: fileURLToPath(
          new URL("./src/components", import.meta.url)
        ),
      },
      {
        find: "@helpers",
        replacement: fileURLToPath(new URL("./src/helpers", import.meta.url)),
      },
      {
        find: "@hooks",
        replacement: fileURLToPath(new URL("./src/hooks", import.meta.url)),
      },
      {
        find: "@layout",
        replacement: fileURLToPath(
          new URL("./src/presentation/layout", import.meta.url)
        ),
      },
      {
        find: "@localization",
        replacement: fileURLToPath(
          new URL("./src/localization", import.meta.url)
        ),
      },
      {
        find: "@pages",
        replacement: fileURLToPath(new URL("./src/pages", import.meta.url)),
      },
      {
        find: "@partials",
        replacement: fileURLToPath(new URL("./src/partials", import.meta.url)),
      },
      {
        find: "@routing",
        replacement: fileURLToPath(new URL("./src/routing", import.meta.url)),
      },
      {
        find: "@services",
        replacement: fileURLToPath(new URL("./src/services", import.meta.url)),
      },
    ],
  },
});
