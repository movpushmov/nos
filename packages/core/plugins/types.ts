import { NosConfig } from "../config";
import { NosProject } from "../projects";

export interface NosPlugin {
  name: string;

  transform(
    config: NosConfig,
    projects: NosProject[]
  ): Promise<NosProject[] | undefined>;
}
