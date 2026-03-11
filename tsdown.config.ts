import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./packages/core/index.ts", "./packages/cli/index.ts"],
  dts: true,
});
