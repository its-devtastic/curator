import React from "react";
import * as R from "ramda";

import type { InjectionZoneEntry, CuratorConfig } from "@/types/config";
import { InjectionZone } from "@/types/config";

import MainMenuItem from "./ui/MainMenuItem";
import ListScreen from "./routes/ListScreen";

export { default as MediaLibraryPopover } from "./ui/MediaLibraryPopover";

export default function mediaLibraryPlugin({
  weight,
}: { weight?: number } = {}) {
  return (config: CuratorConfig): CuratorConfig => {
    return R.evolve({
      routes: R.concat([{ path: "/media-library", element: <ListScreen /> }]),
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
