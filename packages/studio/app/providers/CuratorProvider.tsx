import { CuratorConfig } from "@curatorjs/types";
import * as R from "ramda";
import React, { createContext, useMemo } from "react";

import { getDefaultImageUrl } from "@/utils/images";

export const Context = createContext<CuratorConfig>({} as CuratorConfig);

type PartialCuratorConfig = Partial<Omit<CuratorConfig, "strapiUrl">> &
  Pick<CuratorConfig, "strapiUrl">;

export default function CuratorProvider({
  children,
  config,
}: {
  config: PartialCuratorConfig;
  children: React.ReactNode;
}) {
  const configWithDefaults = useMemo(
    () =>
      R.mergeDeepRight<Omit<CuratorConfig, "strapiUrl">, PartialCuratorConfig>(
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
        config,
      ) as CuratorConfig,
    [config],
  );

  const configAfterPlugins = config.plugins
    ? config.plugins.reduce(
        (config, plugin) => plugin(config),
        configWithDefaults,
      )
    : configWithDefaults;

  return (
    <Context.Provider value={configAfterPlugins}>{children}</Context.Provider>
  );
}
