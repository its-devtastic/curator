import React from "react";
import { useTranslation } from "react-i18next";
import RecentlyOpened from "@/plugins/dashboard/routes/DashboardScreen/RecentlyOpened";

import { DashboardPluginOptions } from "../../index";

const DashboardScreen: React.FC<{ pluginOptions: DashboardPluginOptions }> = ({
  pluginOptions,
}) => {
  const { t } = useTranslation();
  const widgets = pluginOptions.widgets ?? [];

  return (
    <div className="px-4 md:px-12 py-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
      <div className="md:col-span-2 xl:col-span-3">
        <h1>{t("dashboard.welcome")}</h1>
        <div>{t("dashboard.description")}</div>
      </div>
      <div>{widgets.includes("recentlyOpened") && <RecentlyOpened />}</div>
    </div>
  );
};

export default DashboardScreen;
