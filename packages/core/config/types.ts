import { NosPlugin } from "../plugins";

export type TypescriptComponents = {
  types: boolean;
  client: boolean;
};

type OutputTsEnvironment = {
  target: "typescript";
  components: TypescriptComponents;
};

type OutputEnvironment = OutputTsEnvironment;
type OutputOptions = { path: string };

type Output = OutputEnvironment & OutputOptions;

type Input = {
  path: string | string[];
  type: "typebox";
};

export interface NosConfig {
  projects?: string[];
  input: Input;
  output: Output;
  plugins?: NosPlugin[];
}
