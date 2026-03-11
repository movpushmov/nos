import { NosConfig } from "../config";
import { NosAdapter } from "./types";

import { adapter as typeboxAdapter } from "./typebox";

export function getAdapter<T>(config: NosConfig): NosAdapter<T> {
  switch (config.input.type) {
    case "typebox":
      return typeboxAdapter as NosAdapter<T>;
    default:
      throw new Error(`Unsupported adapter type: ${config.input.type}`);
  }
}
