import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Button } from "antd";

import useStrapi from "~/hooks/useStrapi";
import * as R from "ramda";

export default function TeamList() {
  const { t } = useTranslation();
  const { sdk, permissions } = useStrapi();
  const hasPermission = permissions.some(
    R.whereEq({ action: "admin::users.read" })
  );

  return hasPermission ? (
    <div className="px-4 md:px-12">
      <div className="flex items-center justify-between my-12 pb-6 border-b border-0 border-solid border-gray-200">
        <div>
          <h1 className="mt-0 mb-4">{t("team.title")}</h1>
          <div className="text-sm text-gray-600">{t("team.description")}</div>
        </div>
        <Button type="primary" htmlType="submit">
          {t("team.invite")}
        </Button>
      </div>
      <div className="space-y-3"></div>
    </div>
  ) : (
    <div className="mt-24 px-4 md:px-12">
      <Alert type="warning" description={t("phrases.no_view_permission")} />
    </div>
  );
}
