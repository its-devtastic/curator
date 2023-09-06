import React from "react";
import { useTranslation } from "react-i18next";

import ItemList from "./ItemList";

const Recent: React.FC<{ items?: any[] }> = ({ items = [] }) => {
  const { t } = useTranslation();

  return (
    <div className="border border-solid border-gray-200 dark:border-gray-500 rounded-lg dark:bg-gray-700">
      <h2 className="m-0 px-4 py-2 text-base border-0 border-solid border-b border-gray-200 dark:border-gray-500">
        {t("dashboard.recent_activity")}
      </h2>
      <ItemList items={items} />
    </div>
  );
};

export default Recent;
