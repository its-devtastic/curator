import { Alert } from "antd";
import * as R from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";

import useStrapi from "@/hooks/useStrapi";

import SecretsList from "./SecretsList";

export default function SecretsScreen() {
  const { t } = useTranslation();
  const { permissions } = useStrapi();
  const hasPermission = permissions.some(
    R.whereEq({
      action: "plugin::content-manager.explorer.read",
      subject: "plugin::curator.curator-secret",
    }),
  );

  return hasPermission ? (
    <SecretsList />
  ) : (
    <div className="mt-24 px-4 md:px-12">
      <Alert type="warning" description={t("phrases.no_view_permission")} />
    </div>
  );
}
