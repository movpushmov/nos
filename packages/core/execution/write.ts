import { writeFile } from "fs/promises";
import { NosBundle } from "./types";
import { join } from "path";

export async function write(
  output: string,
  projectName: string,
  bundle: NosBundle
) {
  for (const file of bundle.files) {
    await writeFile(
      join(output, projectName, file.path),
      file.content.getText()
    );
  }
}
