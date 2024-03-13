import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: "./src/setup.ts",
    testTimeout: 180000,
  },
});
