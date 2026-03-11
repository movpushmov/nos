import { ts, SourceFile } from "ts-morph";

export interface NosAdapter<InputSchema> {
  name: string;

  toTypescript(schema: InputSchema, file: SourceFile): ts.Node | null;
}
