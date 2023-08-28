import React from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "antd";
import { useTranslation } from "react-i18next";

export default function FieldFilters() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  return (
    <div>
      <Button type="text">{t("content_manager.clear_filters")}</Button>
    </div>
  );
}
