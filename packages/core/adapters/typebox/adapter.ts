import { TSchema } from "typebox";
import { NosAdapter } from "../types";
import { transform } from "./transformers";

export const adapter: NosAdapter<TSchema> = {
  name: "typebox",

  toTypescript(schema, file) {
    if (!schema) {
      return null;
    }

    return transform(schema, file);
  },
};
