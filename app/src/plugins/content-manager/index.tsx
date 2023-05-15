import React from "react";
import * as R from "ramda";

import type { InjectionZoneEntry, StrapionConfig } from "~/types/config";
import { InjectionZone } from "~/types/config";

import MainMenuItem from "./ui/MainMenuItem";

import DetailScreen from "./routes/DetailScreen";
import ContentKindScreen from "./routes/ContentKindScreen";

export default function contentManagerPlugin(
  { groups }: PluginOptions = { groups: [] }
) {
  return (config: StrapionConfig): StrapionConfig => {
    return R.evolve({
      routes: R.concat([
        { path: "/content-manager/:apiID", element: <ContentKindScreen /> },
        { path: "/content-manager/:apiID/:id", element: <DetailScreen /> },
      ]),
      zones: R.append<InjectionZoneEntry>({
        zone: InjectionZone.MainMenuTop,
        weight: 0,
        render() {
          return <MainMenuItem groups={groups} />;
        },
      }),
    })(config);
  };
}

interface PluginOptions {
  groups: { label: string; items: string[] }[];
}
