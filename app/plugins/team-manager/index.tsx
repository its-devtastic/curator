import React from "react";
import * as R from "ramda";
import { RouteObject } from "react-router-dom";

import type { InjectionZoneEntry, StrapionConfig } from "~/types/config";
import { InjectionZone } from "~/types/config";

import TeamList from "./routes/TeamList";
import MainMenuItem from "./ui/MainMenuItem";

export default function teamManagerPlugin() {
  return (config: StrapionConfig): StrapionConfig => {
    return R.evolve({
      zones: R.append<InjectionZoneEntry>({
        zone: InjectionZone.MainMenuTop,
        weight: 40,
        render() {
          return <MainMenuItem />;
        },
      }),
      routes: R.append<RouteObject>({
        path: "/team",
        element: <TeamList />,
      }),
    })(config);
  };
}

interface PluginOptions {
  sharedLink: string;
}
