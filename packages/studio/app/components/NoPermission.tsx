import React from "react";
import { useTranslation } from "react-i18next";
import { PiLock } from "react-icons/pi";

export default function NoPermission() {
  const { t } = useTranslation();

  return (
    <div className="px-4 md:px-12 flex flex-col items-center justify-center flex-1">
      <PiLock className="size-12 mb-2" />
      <h2 className="text-2xl font-bold mb-0.5">
        {t("phrases.no_permission")}
      </h2>
      <div className="text-muted-foreground">
        {t("phrases.no_view_permission")}
      </div>
    </div>
  );
}
