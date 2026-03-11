import { SourceFile } from "ts-morph";

export interface NosTsFile {
  path: string;
  content: SourceFile;
}

export type NosFile = NosTsFile;

export interface NosBundle {
  name: string;
  files: NosFile[];
}
