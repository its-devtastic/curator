import type { CuratorConfig, InjectionZoneEntry } from "@curatorjs/types";
import { InjectionZone } from "@curatorjs/types";
import * as R from "ramda";
import React from "react";

import { usePluginOptions } from "./hooks";
import { DetailScreen } from "./routes/detail";
import { ContentKindScreen } from "./routes/kind";
import { PluginOptions } from "./types";
import ContentManagerMenu from "./ui/ContentManagerMenu";

export default function contentManagerPlugin(options: PluginOptions) {
  return (config: CuratorConfig): CuratorConfig => {
    const setOptions = usePluginOptions((state) => state.setOptions);

    setOptions(options);

    return R.evolve({
      routes: R.concat<CuratorConfig["routes"][number]>([
        {
          path: "/content-manager/:apiID",
          element: <ContentKindScreen />,
        },
        {
          path: "/content-manager/:apiID/:id",
          element: <DetailScreen />,
        },
      ]),
      zones: R.append<InjectionZoneEntry>({
        zone: InjectionZone.MainMenuMiddle,
        weight: options.weight ?? 10,
        render() {
          return <ContentManagerMenu groups={options.menu?.groups ?? []} />;
        },
      }),
    })(config);
  };
}
