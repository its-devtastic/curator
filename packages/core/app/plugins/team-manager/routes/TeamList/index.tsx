import React from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "antd";
import * as R from "ramda";

import useStrapi from "~/hooks/useStrapi";

import TeamList from "./TeamList";

export default function TeamScreen() {
  const { t } = useTranslation();
  const { permissions } = useStrapi();
  const hasPermission = permissions.some(
    R.whereEq({ action: "admin::users.read" })
  );

  return hasPermission ? (
    <TeamList />
  ) : (
    <div className="mt-24 px-4 md:px-12">
      <Alert type="warning" description={t("phrases.no_view_permission")} />
    </div>
  );
}
