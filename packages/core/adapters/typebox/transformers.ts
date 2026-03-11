import {
  IsAny,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInteger,
  IsLiteral,
  IsNull,
  IsNumber,
  IsObject,
  IsPromise,
  IsRef,
  IsString,
  IsUndefined,
  IsUnion,
  IsUnknown,
  IsVoid,
  TArray,
  TEnum,
  TLiteral,
  TObject,
  TPromise,
  TRef,
  TSchema,
  TUnion,
} from "typebox";
import { SourceFile } from "ts-morph";
import ts from "typescript";
import { createTypeboxCall, getConstNode } from "./lib";
import { createTypeboxMapping, TypeboxMapping } from "./mappings";

const mappings: TypeboxMapping[] = [
  createTypeboxMapping({
    type: "Any",
    options: [],
    checker: IsAny,
    transformer: (_, ctx) => ctx.createTypeboxCall(),
  }),
  createTypeboxMapping({
    type: "Array",
    options: [
      "minItems",
      "maxItems",
      "contains",
      "minContains",
      "maxContains",
      "prefixItems",
      "uniqueItems",
    ],
    checker: IsArray,
    transformer: (schema: TArray, ctx) => {
      return ctx.createTypeboxCall([
        transform(schema.items, ctx.file),
        ...ctx.getOptions(),
      ]);
    },
  }),
  createTypeboxMapping({
    type: "Boolean",
    options: [],
    checker: IsBoolean,
    transformer: (_, ctx) => ctx.createTypeboxCall(),
  }),
  createTypeboxMapping({
    type: "Enum",
    options: [],
    checker: IsEnum,
    transformer: (schema: TEnum, ctx) =>
      ctx.createTypeboxCall([
        ts.factory.createArrayLiteralExpression(
          schema.enum.map((item) => getConstNode(item)),
          true
        ),
      ]),
  }),
  createTypeboxMapping({
    type: "Integer",
    options: [
      "exclusiveMaximum",
      "exclusiveMinimum",
      "maximum",
      "minimum",
      "multipleOf",
    ],
    checker: IsInteger,
    transformer: (_, ctx) => ctx.createTypeboxCall([...ctx.getOptions()]),
  }),
  createTypeboxMapping({
    type: "Literal",
    options: [],
    checker: IsLiteral,
    transformer: (schema: TLiteral, ctx) =>
      ctx.createTypeboxCall([getConstNode(schema.const), ...ctx.getOptions()]),
  }),
  createTypeboxMapping({
    type: "Null",
    options: [],
    checker: IsNull,
    transformer: (_, ctx) => ctx.createTypeboxCall(),
  }),
  createTypeboxMapping({
    type: "Number",
    options: [
      "exclusiveMaximum",
      "exclusiveMinimum",
      "maximum",
      "minimum",
      "multipleOf",
    ],
    checker: IsNumber,
    transformer: (_, ctx) => ctx.createTypeboxCall([...ctx.getOptions()]),
  }),
  createTypeboxMapping({
    type: "Object",
    options: [
      "additionalProperties",
      "minProperties",
      "maxProperties",
      "dependencies",
      "dependentRequired",
      "dependentSchemas",
      "patternProperties",
      "propertyNames",
    ],
    checker: IsObject,
    transformer: (schema: TObject, ctx) =>
      ctx.createTypeboxCall([
        ts.factory.createObjectLiteralExpression(
          Object.entries(schema.properties).map(([property, value]) =>
            ts.factory.createPropertyAssignment(
              property,
              schema.required.includes(property)
                ? (transform(value, ctx.file) as ts.Expression)
                : createTypeboxCall("Optional", [
                    transform(value, ctx.file) as ts.Expression,
                  ])
            )
          ),
          true
        ),
        ...ctx.getOptions(),
      ]),
  }),
  createTypeboxMapping({
    type: "Promise",
    options: [],
    checker: IsPromise,
    transformer: (schema: TPromise, ctx) =>
      ctx.createTypeboxCall([transform(schema.item, ctx.file)]),
  }),
  createTypeboxMapping({
    type: "Ref",
    options: [],
    checker: IsRef,
    transformer: (schema: TRef, ctx) =>
      schema.$ref === "#"
        ? ctx.createTypeboxCall([], "This")
        : ctx.createTypeboxCall([getConstNode(schema.$ref)]),
  }),
  createTypeboxMapping({
    type: "String",
    options: ["format", "minLength", "maxLength", "pattern"],
    checker: IsString,
    transformer: (_, ctx) => ctx.createTypeboxCall([...ctx.getOptions()]),
  }),
  createTypeboxMapping({
    type: "Undefined",
    options: [],
    checker: IsUndefined,
    transformer: (_, ctx) => ctx.createTypeboxCall(),
  }),
  createTypeboxMapping({
    type: "Union",
    options: [],
    checker: IsUnion,
    transformer: (schema: TUnion, ctx) =>
      ctx.createTypeboxCall([
        ts.factory.createArrayLiteralExpression(
          schema.anyOf.map((type) => transform(type, ctx.file)),
          true
        ),
      ]),
  }),
  createTypeboxMapping({
    type: "Unknown",
    options: [],
    checker: IsUnknown,
    transformer: (_, ctx) => ctx.createTypeboxCall(),
  }),
  createTypeboxMapping({
    type: "Void",
    options: [],
    checker: IsVoid,
    transformer: (_, ctx) => ctx.createTypeboxCall(),
  }),
];

export function transform(schema: TSchema, file: SourceFile): ts.Expression {
  for (const mapping of Object.values(mappings)) {
    if (mapping.checker(schema)) {
      return mapping.transformer(schema, file);
    }
  }

  throw new Error(`Schema ${schema} has unsupported type.`);
}
