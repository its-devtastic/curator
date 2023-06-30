import React from "react";
import * as R from "ramda";

import type { InjectionZoneEntry, CuratorConfig } from "~/types/config";
import { InjectionZone } from "~/types/config";

import MainMenuItem from "./ui/MainMenuItem";

import DetailScreen from "./routes/DetailScreen";
import ContentKindScreen from "./routes/ContentKindScreen";
import { PluginOptions } from "./types";

export default function contentManagerPlugin(options: PluginOptions) {
  return (config: CuratorConfig): CuratorConfig => {
    return R.evolve({
      routes: R.concat([
        {
          path: "/content-manager/:apiID",
          element: <ContentKindScreen pluginOptions={options} />,
        },
        {
          path: "/content-manager/:apiID/:id",
          element: <DetailScreen pluginOptions={options.edit} />,
        },
      ]),
      zones: R.append<InjectionZoneEntry>({
        zone: InjectionZone.MainMenu,
        weight: 10,
        render() {
          return <MainMenuItem groups={options.menu?.groups ?? []} />;
        },
      }),
    })(config);
  };
}
