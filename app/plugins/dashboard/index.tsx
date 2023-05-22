import React from "react";
import * as R from "ramda";

import type { StrapionConfig } from "~/types/config";
import { InjectionZone, InjectionZoneEntry } from "~/types/config";

import DashboardScreen from "./routes/DashboardScreen";
import MainMenuItem from "./MainMenuItem";

export default function dashboardPlugin() {
  return (config: StrapionConfig): StrapionConfig => {
    return R.evolve({
      routes: R.concat([{ path: "/", element: <DashboardScreen /> }]),
      zones: R.append<InjectionZoneEntry>({
        zone: InjectionZone.MainMenuTop,
        weight: 0,
        render() {
          return <MainMenuItem />;
        },
      }),
    })(config);
  };
}
