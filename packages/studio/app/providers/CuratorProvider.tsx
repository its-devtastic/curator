import React, { createContext } from "react";
import * as R from "ramda";

import { CuratorConfig } from "@/types/config";
import { getDefaultImageUrl } from "@/utils/images";

export const Context = createContext<CuratorConfig>({} as CuratorConfig);

type PartialCuratorConfig = Partial<Omit<CuratorConfig, "strapiUrl">> &
  Pick<CuratorConfig, "strapiUrl">;

const CuratorProvider: React.FC<{
  config: PartialCuratorConfig;
  children: React.ReactNode;
}> = ({ children, config }) => {
  const configWithDefaults = R.mergeDeepRight<
    Omit<CuratorConfig, "strapiUrl">,
    PartialCuratorConfig
  >(
    {
      interfaceLanguages: ["en"],
      plugins: [],
      zones: [],
      contentTypes: [],
      components: [],
      routes: [],
      theme: {},
      hooks: [],
      about: {
        icon: "",
        website: "",
        title: "",
      },
      secrets: true,
      images: { getImageUrl: getDefaultImageUrl },
    },
    config
  ) as CuratorConfig;

  const configAfterPlugins = config.plugins
    ? config.plugins.reduce(
        (config, plugin) => plugin(config),
        configWithDefaults
      )
    : configWithDefaults;

  return (
    <Context.Provider value={configAfterPlugins}>{children}</Context.Provider>
  );
};

export default CuratorProvider;
