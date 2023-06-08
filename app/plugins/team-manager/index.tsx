import React from "react";
import * as R from "ramda";
import { RouteObject } from "react-router-dom";

import type { InjectionZoneEntry, StrapionConfig } from "~/types/config";
import { InjectionZone } from "~/types/config";

import MainMenuItem from "./ui/MainMenuItem";
import TeamList from "./routes/TeamList";
import UserDetail from "./routes/UserDetail";

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
      routes: R.concat<RouteObject[]>([
        {
          path: "/team",
          element: <TeamList />,
        },
        {
          path: "/team/:id",
          element: <UserDetail />,
        },
      ]),
    })(config);
  };
}

interface PluginOptions {
  sharedLink: string;
}
