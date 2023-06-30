import React from "react";
import * as R from "ramda";
import { Link, RouteObject } from "react-router-dom";
import {
  InjectionZoneEntry,
  InjectionZone,
  CuratorConfig,
  MainMenuItem,
} from "@curatorjs/core";

import PlausibleDashboard from "./routes/PlausibleDashboard";

export default function plausiblePlugin({ sharedLink }: PluginOptions) {
  return (config: CuratorConfig): CuratorConfig => {
    return R.evolve({
      zones: R.append<InjectionZoneEntry>({
        zone: InjectionZone.MainMenu,
        weight: 20,
        render() {
          return <MainMenuItem as={Link} to="/analytics" label="Analytics" />;
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
