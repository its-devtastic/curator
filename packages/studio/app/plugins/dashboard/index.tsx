import React from "react";
import * as R from "ramda";

import type { CuratorConfig } from "~/types/config";
import { InjectionZone, InjectionZoneEntry } from "~/types/config";

import DashboardScreen from "./routes/DashboardScreen";
import MainMenuItem from "./MainMenuItem";
import useDashboard from "./useDashboard";

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
      hooks: R.append<any>({
        trigger: "view",
        action: (apiID: string, { id }: any) => {
          useDashboard.getState().addRecentlyOpened(apiID, id);
        },
      }),
    })(config);
  };
}

export interface DashboardPluginOptions {
  recentlyOpened?: {
    renderTitle?(item: any): React.ReactNode;
  };
  weight?: number;
}
