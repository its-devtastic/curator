import React from "react";
import * as R from "ramda";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons";

import { Attribute } from "@/types/contentType";
import useCurator from "@/hooks/useCurator";
import useFilters from "@/hooks/useFilters";
import Popover from "@/ui/Popover";

import Date from "./filters/Date";
import { Button } from "antd";

const FILTER_FORMS: Record<string, any> = {
  datetime: Date,
};

export default function FieldFilter({
  path,
  apiID,
  attribute,
}: {
  path: string;
  apiID: string;
  attribute: Attribute;
}) {
  const { t } = useTranslation();
  const { contentTypes } = useCurator();
  const field = contentTypes
    ?.find(R.whereEq({ apiID }))
    ?.fields.find(R.whereEq({ path }));
  const { filters, removeFilter } = useFilters();
  const filterComponent = FILTER_FORMS[attribute.type];
  const isActive = R.has(path, filters);
  const label = t(field?.label ?? path, { ns: "custom" });

  return (
    <Popover
      arrow
      trigger={["click"]}
      content={(close) => (
        <div className="min-w-[200px]">
          <h4 className="mt-0 mb-2">
            {t("content_manager.filtering_on", { type: label })}
          </h4>
          {filterComponent &&
            React.createElement(filterComponent, {
              attribute,
              path,
              onSubmit: close,
            })}
        </div>
      )}
    >
      <Button size="small" type={isActive ? "default" : "dashed"}>
        <div className="flex items-center gap-2">
          <span
            role="button"
            tabIndex={0}
            className="rounded-full h-4 w-4 bg-gray-200 text-[10px] text-gray-500 inline-flex items-center justify-center"
            onClick={(e) => {
              if (isActive) {
                e.stopPropagation();
                removeFilter(path);
              }
            }}
          >
            {<FontAwesomeIcon icon={isActive ? faClose : faPlus} />}
          </span>
          <span>{label}</span>
          {isActive && (
            <span className="text-indigo-500 text-xs font-semibold">
              {filterComponent?.FilterValue &&
                React.createElement(filterComponent.FilterValue, {
                  filter: filters[path],
                })}
            </span>
          )}
        </div>
      </Button>
    </Popover>
  );
}
