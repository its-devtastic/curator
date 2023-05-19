import React from "react";
import * as R from "ramda";
import { Link, RouteObject } from "react-router-dom";

import type { InjectionZoneEntry, StrapionConfig } from "~/types/config";
import { InjectionZone } from "~/types/config";

import MainMenu from "~/ui/MainMenu";

import PlausibleDashboard from "./routes/PlausibleDashboard";

export default function plausiblePlugin({ sharedLink }: PluginOptions) {
  return (config: StrapionConfig): StrapionConfig => {
    return R.evolve({
      zones: R.append<InjectionZoneEntry>({
        zone: InjectionZone.MainMenuTop,
        weight: 20,
        render() {
          return <MainMenu.Item as={Link} to="/analytics" label="Analytics" />;
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
