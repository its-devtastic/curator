import type { CuratorConfig, InjectionZoneEntry } from "@curatorjs/types";
import { InjectionZone } from "@curatorjs/types";
import * as R from "ramda";
import React from "react";

import ListScreen from "./routes/ListScreen";
import MainMenuItem from "./ui/MainMenuItem";

export { default as MediaLibraryPopover } from "./ui/MediaLibraryPopover";

export default function mediaLibraryPlugin({ weight }: PluginOptions = {}) {
  return (config: CuratorConfig): CuratorConfig => {
    return R.evolve({
      routes: R.concat([
        {
          path: "/media-library",
          element: <ListScreen />,
        },
      ]),
      zones: R.append<InjectionZoneEntry>({
        zone: InjectionZone.MainMenuTop,
        weight: weight ?? 20,
        render() {
          return <MainMenuItem />;
        },
      }),
    })(config);
  };
}

export interface PluginOptions {
  weight?: number;
}
