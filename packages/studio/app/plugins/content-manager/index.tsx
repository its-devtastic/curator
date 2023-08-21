import React from "react";
import * as R from "ramda";

import type { InjectionZoneEntry, CuratorConfig } from "@/types/config";
import { InjectionZone } from "@/types/config";

import DetailScreen from "./routes/DetailScreen";
import ContentKindScreen from "./routes/ContentKindScreen";
import { PluginOptions } from "./types";
import { usePluginOptions } from "./hooks";
import ContentManagerMenu from "./ui/ContentManagerMenu";

export default function contentManagerPlugin(options: PluginOptions) {
  return (config: CuratorConfig): CuratorConfig => {
    const setOptions = usePluginOptions((state) => state.setOptions);

    setOptions(options);

    return R.evolve({
      routes: R.concat([
        {
          path: "/content-manager/:apiID",
          element: <ContentKindScreen />,
        },
        {
          path: "/content-manager/:apiID/:id",
          element: <DetailScreen />,
        },
      ]),
      zones: R.append<InjectionZoneEntry>({
        zone: InjectionZone.MainMenuMiddle,
        weight: options.weight ?? 10,
        render() {
          return <ContentManagerMenu groups={options.menu?.groups ?? []} />;
        },
      }),
    })(config);
  };
}
