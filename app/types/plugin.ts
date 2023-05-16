import { StrapionConfig } from "./config";

export interface StrapionPlugin {
  (config: StrapionConfig): StrapionConfig;
}
