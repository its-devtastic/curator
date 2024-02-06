import type { CuratorConfig, InjectionZoneEntry } from "@curatorjs/types";
import { InjectionZone } from "@curatorjs/types";
import * as R from "ramda";
import React from "react";
import { RouteObject } from "react-router-dom";

import AuditScreen from "./routes/AuditScreen";
import MainMenuItem from "./ui/MainMenuItem";

export default function auditPlugin({ weight }: { weight?: number } = {}) {
  return (config: CuratorConfig): CuratorConfig => {
    return R.evolve({
      zones: R.append<InjectionZoneEntry>({
        zone: InjectionZone.MainMenuBottom,
        weight: weight ?? 50,
        render() {
          return <MainMenuItem />;
        },
      }),
      routes: R.concat<RouteObject[]>([
        {
          path: "/audit",
          element: <AuditScreen />,
        },
      ]),
    })(config);
  };
}

interface PluginOptions {
  sharedLink: string;
}
