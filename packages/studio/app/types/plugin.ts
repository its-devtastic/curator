import { CuratorConfig } from "./config";

export interface CuratorPlugin {
  (config: CuratorConfig): CuratorConfig;
}
