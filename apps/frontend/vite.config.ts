import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import * as path from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  test: {
    alias: {
      "@/": path.resolve(__dirname, "./src/"),
    },
    environment: "jsdom",
    globals: true,
    setupFiles: [path.resolve(__dirname, "vitest.setup.ts")],
    onConsoleLog() {
      return true;
    },
  },
});
