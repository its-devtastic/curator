import * as R from "ramda";
import React from "react";

import NoPermission from "@/components/NoPermission";
import useStrapi from "@/hooks/useStrapi";

import TeamList from "./TeamList";

export default function TeamScreen() {
  const { permissions } = useStrapi();
  const hasPermission = permissions.some(
    R.whereEq({ action: "admin::users.read" }),
  );

  return hasPermission ? <TeamList /> : <NoPermission />;
}
