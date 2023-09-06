import React from "react";
import * as R from "ramda";

import type { CuratorConfig } from "@/types/config";
import { InjectionZone, InjectionZoneEntry } from "@/types/config";

import DashboardScreen from "./routes/DashboardScreen";
import MainMenuItem from "./MainMenuItem";

export default function dashboardPlugin(
  pluginOptions: DashboardPluginOptions = {}
) {
  return (config: CuratorConfig): CuratorConfig => {
    return R.evolve({
      routes: R.concat([
        {
          path: "/",
          element: <DashboardScreen pluginOptions={pluginOptions} />,
        },
      ]),
      zones: R.append<InjectionZoneEntry>({
        zone: InjectionZone.MainMenuTop,
        weight: pluginOptions.weight ?? 0,
        render() {
          return <MainMenuItem />;
        },
      }),
    })(config);
  };
}

export interface DashboardPluginOptions {
  widgets?: ("recent" | "drafts")[];
  weight?: number;
}
