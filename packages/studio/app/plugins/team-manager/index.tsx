import type { CuratorConfig, InjectionZoneEntry } from "@curatorjs/types";
import { InjectionZone } from "@curatorjs/types";
import * as R from "ramda";
import React from "react";
import { RouteObject } from "react-router-dom";

import TeamList from "./routes/TeamList";
import UserDetail from "./routes/UserDetail";
import MainMenuItem from "./ui/MainMenuItem";

export default function teamManagerPlugin({
  weight,
}: { weight?: number } = {}) {
  return (config: CuratorConfig): CuratorConfig => {
    return R.evolve({
      zones: R.append<InjectionZoneEntry>({
        zone: InjectionZone.MainMenuBottom,
        weight: weight ?? 40,
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
