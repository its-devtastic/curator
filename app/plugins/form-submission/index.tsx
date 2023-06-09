import React from "react";
import * as R from "ramda";

import type { InjectionZoneEntry, StrapionConfig } from "~/types/config";
import { InjectionZone } from "~/types/config";

import MainMenuItem from "./ui/MainMenuItem";

import FormSubmissionsScreen from "./routes/FormSubmissionsScreen";

export default function formSubmissionPlugin() {
  return (config: StrapionConfig): StrapionConfig => {
    return R.evolve({
      routes: R.concat([
        { path: "/form-submissions", element: <FormSubmissionsScreen /> },
      ]),
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

interface PluginOptions {
  groups: { label: string; items: string[] }[];
}
