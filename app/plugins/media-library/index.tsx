import React from "react";
import * as R from "ramda";

import type { InjectionZoneEntry, StrapionConfig } from "~/types/config";
import { InjectionZone } from "~/types/config";

import MainMenuItem from "./ui/MainMenuItem";

export default function mediaLibraryPlugin() {
  return (config: StrapionConfig): StrapionConfig => {
    return R.evolve({
      zones: R.append<InjectionZoneEntry>({
        zone: InjectionZone.MainMenuTop,
        weight: 10,
        render() {
          return <MainMenuItem />;
        },
      }),
    })(config);
  };
}
