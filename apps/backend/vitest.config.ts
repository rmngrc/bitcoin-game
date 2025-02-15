import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    reporters: ["verbose"],
    environment: "node",
    onConsoleLog(log) {
      return true;
    },
  },
});
