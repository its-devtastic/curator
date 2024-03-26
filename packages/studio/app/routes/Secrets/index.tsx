import * as R from "ramda";
import React from "react";

import NoPermission from "@/components/NoPermission";
import useStrapi from "@/hooks/useStrapi";

import SecretsList from "./SecretsList";

export default function SecretsScreen() {
  const { permissions } = useStrapi();
  const hasPermission = permissions.some(
    R.whereEq({
      action: "plugin::content-manager.explorer.read",
      subject: "plugin::curator.curator-secret",
    }),
  );

  return hasPermission ? <SecretsList /> : <NoPermission />;
}
