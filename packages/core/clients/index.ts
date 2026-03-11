import { SourceFile } from "ts-morph";
import { NosConfig } from "../config";
import { getTypescriptClient } from "./typescript";

export function getClient(config: NosConfig) {
  switch (config.output.target) {
    case "typescript": {
      return (file: SourceFile) => getTypescriptClient(config, file);
    }
  }
}
