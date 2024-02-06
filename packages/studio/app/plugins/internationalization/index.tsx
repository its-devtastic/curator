import type { CuratorConfig, InjectionZoneEntry } from "@curatorjs/types";
import { InjectionZone } from "@curatorjs/types";
import * as R from "ramda";
import React from "react";
import { RouteObject } from "react-router-dom";

import Internationalization from "./routes/Internationalization";
import MainMenuItem from "./ui/MainMenuItem";

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
