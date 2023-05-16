import React from "react";
import * as R from "ramda";

import type { InjectionZoneEntry, StrapionConfig } from "~/types/config";
import { InjectionZone } from "~/types/config";

import AppHeaderItem from "./ui/AppHeaderItem";

export default function triggerPlugin({ url }: PluginOptions) {
  return (config: StrapionConfig): StrapionConfig => {
    return R.evolve({
      zones: R.append<InjectionZoneEntry>({
        zone: InjectionZone.AppHeaderRight,
        weight: 0,
        render() {
          return <AppHeaderItem url={url} />;
        },
      }),
    })(config);
  };
}

interface PluginOptions {
  url: string;
}
