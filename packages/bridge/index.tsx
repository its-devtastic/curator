import { CuratorConfig } from "@curatorjs/studio";

export default function bridgePlugin(options: PluginOptions) {
  return (config: CuratorConfig): CuratorConfig => {
    return config;
  };
}

interface PluginOptions {}
