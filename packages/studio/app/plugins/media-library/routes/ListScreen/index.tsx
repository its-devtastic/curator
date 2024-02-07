import * as R from "ramda";
import React from "react";

import NoPermission from "@/components/NoPermission";
import useStrapi from "@/hooks/useStrapi";

import MediaList from "./MediaList";

export default function ListScreen() {
  const { permissions } = useStrapi();
  const hasPermission = permissions.some(
    R.whereEq({ action: "plugin::upload.read" }),
  );

  return hasPermission ? <MediaList /> : <NoPermission />;
}
