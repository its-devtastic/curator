import { MainMenuItem } from "@curatorjs/studio";
import {
  CuratorPlugin,
  InjectionZone,
  InjectionZoneEntry,
} from "@curatorjs/types";
import * as R from "ramda";
import * as React from "react";
import { RouteObject } from "react-router-dom";

import icon from "./assets/icon.png";
import PlausibleDashboard from "./routes/PlausibleDashboard";

export default function plausiblePlugin({
  sharedLink,
}: PluginOptions): CuratorPlugin {
  return (config) => {
    return R.evolve({
      zones: R.append<InjectionZoneEntry>({
        zone: InjectionZone.MainMenuBottom,
        weight: 20,
        render() {
          return (
            <MainMenuItem
              to="/analytics"
              label="Analytics"
              icon={
                <img src={icon} className="w-5 h-5 object-contain" alt="" />
              }
            />
          );
        },
      }),
      routes: R.append<RouteObject>({
        path: "/analytics",
        element: <PlausibleDashboard sharedLink={sharedLink} />,
      }),
    })(config);
  };
}

interface PluginOptions {
  sharedLink: string;
}
