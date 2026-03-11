import { NosConfig } from "../config";
import { NosProject } from "../projects";
import { NosBundle } from "./types";
import { Project, ScriptTarget } from "ts-morph";
import { getTypescriptBundle } from "./lib/typescript";

export function makeBundle(config: NosConfig, project: NosProject): NosBundle {
  const bundle: NosBundle = {
    name: project.name,
    files: [],
  };

  switch (config.output.target) {
    case "typescript": {
      getTypescriptBundle({
        config,
        components: config.output.components,
        controllers: project.controllers,
        bundle,
        typescriptProject: new Project({
          compilerOptions: {
            target: ScriptTarget.ESNext,
          },
          useInMemoryFileSystem: true,
        }),
      });

      break;
    }
  }

  return bundle;
}
