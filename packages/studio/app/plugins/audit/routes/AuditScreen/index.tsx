import * as R from "ramda";
import React from "react";

import NoPermission from "@/components/NoPermission";
import useStrapi from "@/hooks/useStrapi";

import AuditList from "./AuditList";

export default function AuditScreen() {
  const { permissions } = useStrapi();
  const hasPermission = permissions.some(
    R.whereEq({
      action: "plugin::content-manager.explorer.read",
      subject: "plugin::curator.curator-audit-log",
    }),
  );

  return hasPermission ? <AuditList /> : <NoPermission />;
}
