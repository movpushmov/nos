/// <reference types="vitest/config" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    include: ["packages/**/__tests__/**/*.test.ts"],
  },
});
