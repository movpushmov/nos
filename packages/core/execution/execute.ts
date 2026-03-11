import { NosConfig } from "../config";
import { tsImport } from "tsx/esm/api";
import { NosProject } from "../projects";
import { makeBundle } from "./bundle";
import { write } from "./write";

async function getProjects(inputFiles: string[] = []): Promise<NosProject[]> {
  return Promise.all(
    inputFiles.map(async (file) => {
      return tsImport(file, import.meta.url);
    })
  );
}

function filterProjects(
  projects: NosProject[],
  projectsFilter: string[] | undefined
): NosProject[] {
  if (!projectsFilter || projectsFilter.length === 0) {
    return projects;
  }

  return projects.filter((project) => projectsFilter.includes(project.name));
}

export async function executeConfig(config: NosConfig) {
  const { input, projects: projectsFilter } = config;
  const projects = filterProjects(
    await getProjects(Array.isArray(input.path) ? input.path : [input.path]),
    projectsFilter
  );

  for (const plugin of config.plugins ?? []) {
    await plugin.transform(config, projects);
  }

  return projects;
}

export async function execute(configs: NosConfig[]) {
  for (const config of configs) {
    const projects = await executeConfig(config);

    for (const project of projects) {
      await write(
        config.output.path,
        project.name,
        makeBundle(config, project)
      );
    }
  }
}
