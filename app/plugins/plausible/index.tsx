import React from "react";
import * as R from "ramda";
import { Link, RouteObject } from "react-router-dom";
import { Tooltip } from "antd";

import type { InjectionZoneEntry, StrapionConfig } from "~/types/config";
import { InjectionZone } from "~/types/config";

import MainMenu from "~/ui/MainMenu";

import logo from "./icon.png";
import PlausibleDashboard from "./routes/PlausibleDashboard";

export default function plausiblePlugin({ sharedLink }: PluginOptions) {
  return (config: StrapionConfig): StrapionConfig => {
    return R.evolve({
      zones: R.append<InjectionZoneEntry>({
        zone: InjectionZone.MainMenuTop,
        weight: 20,
        render() {
          return (
            <Tooltip title="Plausible Analytics" placement="right">
              <MainMenu.Item as={Link} to="/analytics">
                <img src={logo} alt="" className="w-8 h-8 object-contain" />
              </MainMenu.Item>
            </Tooltip>
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
