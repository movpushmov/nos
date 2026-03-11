import { SourceFile, ts } from "ts-morph";

export function createTypeboxCall(
  identifier: string,
  expressions: ts.Expression[]
) {
  return ts.factory.createCallExpression(
    ts.factory.createIdentifier(identifier),
    undefined,
    expressions
  );
}

export function getConstNode(value: unknown): ts.Expression {
  const unsupportedError = new Error(
    `Value ${value} has unsupported type ${typeof value}`
  );

  switch (typeof value) {
    case "boolean":
      return value ? ts.factory.createTrue() : ts.factory.createFalse();
    case "string":
      return ts.factory.createStringLiteral(value, true);
    case "number":
      return ts.factory.createNumericLiteral(value);
    case "undefined":
      return ts.factory.createIdentifier("undefined");
    case "object":
      throw unsupportedError;
    case "bigint":
      throw unsupportedError;
    case "symbol":
      throw unsupportedError;
    case "function":
      throw unsupportedError;
  }
}

export function getOptions(schema: object, options: string[] = []) {
  return Object.entries(schema).reduce<[string, any][]>((acc, option) => {
    if (options.includes(option[0])) {
      acc.push(option);
    }

    return acc;
  }, []);
}

export function getNodeFromOptions(options: [string, any][]) {
  return ts.factory.createObjectLiteralExpression(
    options.map(([property, value]) =>
      ts.factory.createPropertyAssignment(property, getConstNode(value))
    )
  );
}
