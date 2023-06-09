import React from "react";
import * as R from "ramda";

import type { InjectionZoneEntry, StrapionConfig } from "~/types/config";
import { InjectionZone } from "~/types/config";

import MainMenuItem from "./ui/MainMenuItem";
import ListScreen from "./routes/ListScreen";

export default function mediaLibraryPlugin() {
  return (config: StrapionConfig): StrapionConfig => {
    return R.evolve({
      routes: R.concat([{ path: "/media-library", element: <ListScreen /> }]),
      zones: R.append<InjectionZoneEntry>({
        zone: InjectionZone.MainMenu,
        weight: 10,
        render() {
          return <MainMenuItem />;
        },
      }),
    })(config);
  };
}
