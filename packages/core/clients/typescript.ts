import { NosConfig } from "../config";
import { SourceFile } from "ts-morph";

export function getTypescriptClient(config: NosConfig, file: SourceFile) {
  file.replaceWithText(`
import { wretch, type Wretch } from 'wretch';

export type Result<Ok, Fail> =
  | { success: true; data: Ok }
  | { success: false; data: Fail };

interface ClientOptions {
  baseUrl: string;
  headers?: Record<string, string>;
}

export function createClient(options: ClientOptions) {
  return wretch(options.baseUrl, {
    headers: options.headers,
  });
}
    `);

  return file;
}
