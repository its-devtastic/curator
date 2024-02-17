import { Button } from "@curatorjs/ui";
import * as R from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import useFilters from "@/hooks/useFilters";
import useStrapi from "@/hooks/useStrapi";

import FieldFilter from "./FieldFilter";

export default function FieldFilters() {
  const { t } = useTranslation();
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
        <Button variant="ghost" size="sm" onClick={() => clearFilters()}>
          {t("content_manager.clear_filters")}
        </Button>
      )}
    </div>
  );
}
