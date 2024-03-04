import { Attribute } from "@curatorjs/types";
import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@curatorjs/ui";
import * as R from "ramda";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import useCurator from "@/hooks/useCurator";
import useFilters from "@/hooks/useFilters";

import AdminUser from "./filters/AdminUser";
import Date from "./filters/Date";
import Integer from "./filters/Integer";
import Relation from "./filters/Relation";
import String from "./filters/String";

const FILTER_FORMS: Record<string, any> = {
  datetime: Date,
  integer: Integer,
  string: String,
  relation: Relation,
  admin: AdminUser,
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
  const { filters } = useFilters();
  const filterComponent =
    FILTER_FORMS[attribute.target === "admin::user" ? "admin" : attribute.type];
  const isActive = R.has(path, filters);
  const label = t(field?.label ?? path, { ns: "custom" });
  const [open, setOpen] = useState(false);

  return filterComponent ? (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" className="border-dashed">
          <div className="flex items-center gap-2">
            <span>{label}</span>
            {isActive && (
              <Badge variant="secondary">
                {filterComponent?.FilterValue &&
                  React.createElement(filterComponent.FilterValue, {
                    filter: filters[path],
                    attribute,
                  })}
              </Badge>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="min-w-[200px]">
          <h4 className="mb-4 text-sm font-semibold">
            {t("content_manager.filtering_on", { type: label })}
          </h4>
          {filterComponent &&
            React.createElement(filterComponent, {
              attribute,
              path,
              onSubmit: () => setOpen(false),
            })}
        </div>
      </PopoverContent>
    </Popover>
  ) : null;
}
