import { SourceFile } from "ts-morph";

interface ModifyImportsOptions {
  file: SourceFile;
  namedImports: string[];
  module: string;
}

export function modifyImports(options: ModifyImportsOptions) {
  const { file, namedImports, module } = options;

  const importDeclaration = file.getImportDeclaration(
    (declaration) =>
      declaration.getModuleSpecifier().getText() === `"${module}"`
  );

  if (!importDeclaration) {
    file.addImportDeclaration({
      moduleSpecifier: module,
      namedImports: namedImports,
    });
  }

  for (const namedImport of namedImports) {
    const namedImportDeclaration = importDeclaration
      ?.getNamedImports()
      .find((i) => i.getText() === namedImport);

    if (!namedImportDeclaration) {
      importDeclaration?.addNamedImport(namedImport);
    }
  }
}
