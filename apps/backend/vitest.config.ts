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
      if (log.match(/ParseError/)) {
        return false;
      }
      return true;
    },
    reporters: ["verbose"],
  },
});
