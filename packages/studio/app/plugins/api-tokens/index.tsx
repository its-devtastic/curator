import React from "react";
import * as R from "ramda";
import { RouteObject } from "react-router-dom";

import type { InjectionZoneEntry, CuratorConfig } from "@/types/config";
import { InjectionZone } from "@/types/config";

import MainMenuItem from "./ui/MainMenuItem";
import ApiTokens from "./routes/ApiTokens";

/**
 * Plugin for managing available API tokens.
 */
export default function apiTokensPlugin({ weight }: { weight?: number } = {}) {
  return (config: CuratorConfig): CuratorConfig => {
    return R.evolve({
      zones: R.append<InjectionZoneEntry>({
        zone: InjectionZone.MainMenuSettings,
        weight: weight ?? 30,
        render() {
          return <MainMenuItem />;
        },
      }),
      routes: R.concat<RouteObject[]>([
        {
          path: "/settings/api-tokens",
          element: <ApiTokens />,
        },
      ]),
    })(config);
  };
}

interface PluginOptions {
  sharedLink: string;
}
