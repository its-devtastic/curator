import React from "react";
import * as R from "ramda";
import { RouteObject } from "react-router-dom";

import type { InjectionZoneEntry, CuratorConfig } from "@curatorjs/types";
import { InjectionZone } from "@curatorjs/types";

import MainMenuItem from "./ui/MainMenuItem";
import AuditScreen from "./routes/AuditScreen";

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
