import * as R from "ramda";
import React from "react";

import NoPermission from "@/components/NoPermission";
import useStrapi from "@/hooks/useStrapi";

import Internationalization from "./Internationalization";

export default function InternationalizationScreen() {
  const { permissions } = useStrapi();
  const hasPermission = permissions.some(
    R.whereEq({ action: "plugin::i18n.locale.read" }),
  );

  return hasPermission ? <Internationalization /> : <NoPermission />;
}
