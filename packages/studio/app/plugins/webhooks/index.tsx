import React from "react";
import * as R from "ramda";
import { RouteObject } from "react-router-dom";

import type { InjectionZoneEntry, CuratorConfig } from "@/types/config";
import { InjectionZone } from "@/types/config";

import MainMenuItem from "./ui/MainMenuItem";
import Webhooks from "./routes/Webhooks";

/**
 * Plugin for managing available locales.
 */
export default function webhooksPlugin({ weight }: { weight?: number } = {}) {
  return (config: CuratorConfig): CuratorConfig => {
    return R.evolve({
      zones: R.append<InjectionZoneEntry>({
        zone: InjectionZone.MainMenuSettings,
        weight: weight ?? 35,
        render() {
          return <MainMenuItem />;
        },
      }),
      routes: R.concat<RouteObject[]>([
        {
          path: "/settings/webhooks",
          element: <Webhooks />,
        },
      ]),
    })(config);
  };
}

interface PluginOptions {
  sharedLink: string;
}
