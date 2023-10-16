import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import * as R from "ramda";

import useStrapi from "@/hooks/useStrapi";
import useFilters from "@/hooks/useFilters";

import FieldFilter from "./FieldFilter";

export default function FieldFilters() {
  const { t } = useTranslation();
  const [_, setSearchParams] = useSearchParams();
  const params = useParams();
  const { contentTypes } = useStrapi();
  const apiID = params.apiID as string;
  const attributes = contentTypes.find(R.whereEq({ apiID }))?.attributes ?? {};
  const { filters, clearFilters } = useFilters();

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {Object.entries(attributes).map(([path, attribute]) => (
        <FieldFilter
          key={path}
          path={path}
          attribute={attribute}
          apiID={apiID}
        />
      ))}
      {!R.isEmpty(filters) && (
        <Button type="link" onClick={() => clearFilters()}>
          {t("content_manager.clear_filters")}
        </Button>
      )}
    </div>
  );
}
