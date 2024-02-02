import React from "react";
import { useTranslation } from "react-i18next";

import ItemList from "./ItemList";

const Recent: React.FC<{ items?: any[] }> = ({ items = [] }) => {
  const { t } = useTranslation();

  return (
    <div className="border border-solid border-gray-200 dark:border-gray-500 rounded-lg dark:bg-gray-700 bg-white shadow-gray-900/5">
      <h2 className="m-0 p-4 text-base font-semibold">
        {t("dashboard.recent_activity")}
      </h2>
      <ItemList items={items} />
    </div>
  );
};

export default Recent;
