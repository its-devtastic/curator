import React from "react";
import { useTranslation } from "react-i18next";
import { useAsync } from "react-use";

import useStrapi from "@/hooks/useStrapi";

import { DashboardPluginOptions } from "../../index";
import Recent from "./Recent";
import Drafts from "./Drafts";

const DashboardScreen: React.FC<{ pluginOptions: DashboardPluginOptions }> = ({
  pluginOptions,
}) => {
  const { t } = useTranslation();
  const widgets = pluginOptions.widgets ?? [];
  const { sdk } = useStrapi();

  const { value } = useAsync(async () => {
    return sdk.getDashboard();
  }, [sdk]);

  return (
    <div className="px-4 md:px-12 py-12">
      <div className="mb-12">
        <h1 className="font-semibold">{t("dashboard.welcome")}</h1>
        <div>{t("dashboard.description")}</div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
        {widgets.includes("recent") && <Recent items={value?.recent} />}
        {widgets.includes("drafts") && <Drafts items={value?.drafts} />}
      </div>
    </div>
  );
};

export default DashboardScreen;
