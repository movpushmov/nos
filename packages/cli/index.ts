import { join } from "path";
import { execute } from "../core";

const currentFolder = process.cwd();
const file = join(currentFolder, "nos.config.ts");
const config = await import(file);

execute(config.default);
