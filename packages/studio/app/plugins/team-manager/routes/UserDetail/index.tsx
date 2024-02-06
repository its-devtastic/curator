import * as R from "ramda";
import React from "react";

import NoPermission from "@/components/NoPermission";
import useStrapi from "@/hooks/useStrapi";

import UserDetail from "./UserDetail";

export default function UserDetailScreen() {
  const { permissions } = useStrapi();
  const hasPermission = permissions.some(
    R.whereEq({ action: "admin::users.read" }),
  );

  return hasPermission ? <UserDetail /> : <NoPermission />;
}
