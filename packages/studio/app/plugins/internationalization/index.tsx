import React from "react";
import * as R from "ramda";
import { RouteObject } from "react-router-dom";

import type { InjectionZoneEntry, CuratorConfig } from "@curatorjs/types";
import { InjectionZone } from "@curatorjs/types";

import MainMenuItem from "./ui/MainMenuItem";
import Internationalization from "./routes/Internationalization";

/**
 * Plugin for managing available locales.
 */
export default function internationalizationPlugin({
  weight,
}: { weight?: number } = {}) {
  return (config: CuratorConfig): CuratorConfig => {
    return R.evolve({
      zones: R.append<InjectionZoneEntry>({
        zone: InjectionZone.MainMenuSettings,
        weight: weight ?? 40,
        render() {
          return <MainMenuItem />;
        },
      }),
      routes: R.concat<RouteObject[]>([
        {
          path: "/settings/internationalization",
          element: <Internationalization />,
        },
      ]),
    })(config);
  };
}

interface PluginOptions {
  sharedLink: string;
}
