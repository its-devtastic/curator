import type { CuratorConfig, InjectionZoneEntry } from "@curatorjs/types";
import { InjectionZone } from "@curatorjs/types";
import * as R from "ramda";
import React from "react";
import { RouteObject } from "react-router-dom";

import ApiTokens from "./routes/ApiTokens";
import MainMenuItem from "./ui/MainMenuItem";

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
