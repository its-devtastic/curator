import React, { createContext } from "react";

import { CuratorConfig } from "@/types/config";

export const Context = createContext<CuratorConfig>({} as CuratorConfig);

const CuratorProvider: React.FC<{
  config: CuratorConfig;
  children: React.ReactNode;
}> = ({ children, config }) => {
  const configAfterPlugins = config.plugins
    ? config.plugins.reduce((config, plugin) => plugin(config), config)
    : config;

  return (
    <Context.Provider value={configAfterPlugins}>{children}</Context.Provider>
  );
};

export default CuratorProvider;
