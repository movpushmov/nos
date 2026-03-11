import { SourceFile, ts } from "ts-morph";
import { createTypeboxCall, getNodeFromOptions, getOptions } from "./lib";

import { modifyImports } from "../../lib/typescript";

interface TransformerContext {
  file: SourceFile;

  createTypeboxCall: (
    expressions?: ts.Expression[],
    customIdentifier?: string
  ) => ts.CallExpression;

  getOptions: () => ts.Expression[];
}

export interface TypeboxMapping {
  type: string;
  checker: (value: unknown) => boolean;
  transformer: (schema: unknown, file: SourceFile) => ts.CallExpression;
}

interface Options {
  type: string;
  options: string[];
  checker: (value: unknown) => boolean;
  transformer: (schema: any, ctx: TransformerContext) => ts.CallExpression;
}

export function createTypeboxMapping(options: Options): TypeboxMapping {
  return {
    type: options.type,
    checker: options.checker,
    transformer: (schema, file) => {
      modifyImports({ file, namedImports: [options.type], module: "typebox" });

      return options.transformer(schema, {
        file,

        createTypeboxCall: (expressions = [], customIdentifier) => {
          return createTypeboxCall(
            customIdentifier ?? options.type,
            expressions
          );
        },

        getOptions: () => {
          const originalOptions = getOptions(schema as object, options.options);

          if (originalOptions.length === 0) {
            return [];
          }

          return [getNodeFromOptions(originalOptions)];
        },
      });
    },
  };
}
