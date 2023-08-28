import React from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "antd";
import * as R from "ramda";

import useStrapi from "@/hooks/useStrapi";

import Internationalization from "./Internationalization";

export default function TeamScreen() {
  const { t } = useTranslation();
  const { permissions } = useStrapi();
  const hasPermission = permissions.some(
    R.whereEq({ action: "plugin::i18n.locale.read" })
  );

  return hasPermission ? (
    <Internationalization />
  ) : (
    <div className="mt-24 px-4 md:px-12">
      <Alert type="warning" description={t("phrases.no_view_permission")} />
    </div>
  );
}
