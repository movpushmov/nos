import { NosConfig } from "./types";

export function defineConfig(config: NosConfig | NosConfig[]): NosConfig[] {
  return Array.isArray(config) ? config : [config];
}
