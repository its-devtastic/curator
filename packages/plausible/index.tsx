import React from "react";
import * as R from "ramda";
import { RouteObject } from "react-router-dom";
import {
  InjectionZoneEntry,
  InjectionZone,
  CuratorConfig,
  MainMenuItem,
} from "@curatorjs/studio";

import PlausibleDashboard from "./routes/PlausibleDashboard";
import icon from "./assets/icon.png";

export default function plausiblePlugin({ sharedLink }: PluginOptions) {
  return (config: CuratorConfig): CuratorConfig => {
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
                <span>
                  <img
                    src={icon.src}
                    className="w-6 h-6 object-contain"
                    alt=""
                  />
                </span>
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
