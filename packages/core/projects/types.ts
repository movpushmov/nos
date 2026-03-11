import { TSchema } from "typebox";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface NosProjectPath {
  name: string;
  request?: {
    params?: TSchema;
    query?: TSchema;
    body?: TSchema;
    headers?: TSchema;
    cookies?: TSchema;
  };
  responses: Record<number, TSchema>;
}

export interface NosProjectController {
  name: string;
  prefix?: string;
  paths: Record<string, Partial<Record<HttpMethod, NosProjectPath>>>;
}

export interface NosProject {
  name: string;
  version: string;

  controllers: NosProjectController[];
}
