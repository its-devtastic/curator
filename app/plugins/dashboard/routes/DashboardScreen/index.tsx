import React from "react";
import { useTranslation } from "react-i18next";

import useStrapi from "~/hooks/useStrapi";

const DashboardScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="py-12 grid grid-cols-3">
      <div>
        <h1>{t("dashboard.welcome")}</h1>
        <div>{t("dashboard.description")}</div>
      </div>
    </div>
  );
};

export default DashboardScreen;
