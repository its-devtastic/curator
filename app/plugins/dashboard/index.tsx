import React from "react";
import * as R from "ramda";

import type { StrapionConfig } from "~/types/config";

import DashboardScreen from "./routes/DashboardScreen";

export default function dashboardPlugin() {
  return (config: StrapionConfig): StrapionConfig => {
    return R.evolve({
      routes: R.concat([{ path: "/", element: <DashboardScreen /> }]),
    })(config);
  };
}
