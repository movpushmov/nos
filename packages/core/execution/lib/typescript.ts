import { Project, SourceFile, ts, VariableDeclarationKind } from "ts-morph";
import { NosConfig, TypescriptComponents } from "../../config";
import { NosProjectController } from "../../projects";
import { camelCase, pascalCase } from "es-toolkit";
import { getAdapter } from "../../adapters";
import { NosBundle } from "../types";
import { modifyImports } from "../../lib/typescript";

function getName(original: string): { camel: string; pascal: string } {
  return {
    camel: camelCase(original),
    pascal: pascalCase(original),
  };
}

interface TypescriptBundleOptions {
  components: TypescriptComponents;
  config: NosConfig;
  typescriptProject: Project;
  controllers: NosProjectController[];
  bundle: NosBundle;
}

export function getTypescriptBundle(options: TypescriptBundleOptions) {
  const { config, bundle, components, controllers, typescriptProject } =
    options;

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  const barrelFile = typescriptProject.createSourceFile("controllers/index.ts");

  for (const controller of controllers) {
    const controllerName = getName(controller.name);
    const file = typescriptProject.createSourceFile(
      `controllers/${controllerName.camel}.ts`
    );

    for (const url of Object.keys(controller.paths)) {
      const endpoints = controller.paths[url];

      if (!endpoints) continue;

      for (const [method, path] of Object.entries(endpoints)) {
        const adapter = getAdapter(config);

        const pathName = getName(path.name);

        const pathModule = file.addModule({
          name: pathName.camel,
          hasDeclareKeyword: true,
          isExported: true,
          statements: [],
        });

        const schemas = [
          { name: getName("body"), schema: path.request?.body },
          { name: getName("query"), schema: path.request?.query },
          { name: getName("params"), schema: path.request?.params },
          { name: getName("headers"), schema: path.request?.headers },
        ];

        pathModule.addVariableStatement({
          isExported: true,
          declarationKind: VariableDeclarationKind.Const,
          declarations: [
            {
              name: "path",
              initializer: `'${url}'`,
            },
          ],
        });

        pathModule.addVariableStatement({
          isExported: true,
          declarationKind: VariableDeclarationKind.Const,
          declarations: [
            {
              name: "method",
              initializer: `'${method}'`,
            },
          ],
        });

        for (const { name, schema } of schemas) {
          if (schema) {
            pathModule.addVariableStatement({
              isExported: true,
              declarationKind: VariableDeclarationKind.Const,
              declarations: [
                {
                  name: `${name.camel}Schema`,
                  initializer: printer.printNode(
                    ts.EmitHint.Unspecified,
                    adapter.toTypescript(schema, file)!,
                    file.compilerNode
                  ),
                },
              ],
            });
          }
        }

        if (components.types) {
          modifyImports({ file, namedImports: ["Static"], module: "typebox" });

          for (const { name, schema } of schemas) {
            if (schema) {
              pathModule.addTypeAlias({
                isExported: true,
                type: `Static<typeof ${name.camel}Schema>`,
                name: `${name.pascal}Schema`,
              });
            }
          }
        }
      }
    }

    barrelFile.addExportDeclaration({
      moduleSpecifier: `./${controllerName.camel}`,
      namespaceExport: controllerName.camel,
    });

    bundle.files.push({
      path: `controllers/${controllerName.camel}.ts`,
      content: file,
    });
  }

  bundle.files.push({
    path: "controllers/index.ts",
    content: barrelFile,
  });

  if (components.client) {
    const clientFile = typescriptProject.createSourceFile("client.ts");

    bundle.files.push({
      path: "client.ts",
      content: clientFile,
    });
  }
}
