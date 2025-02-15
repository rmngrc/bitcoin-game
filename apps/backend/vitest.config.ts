import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    env: {
      STAGE: "local",
      DYNAMODB_TABLE: "test-table",
    },
    environment: "node",
    onConsoleLog(log) {
      return true;
    },
    reporters: ["verbose"],
  },
});
