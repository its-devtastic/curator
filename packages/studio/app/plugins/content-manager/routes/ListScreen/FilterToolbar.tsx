import { StrapiContentType } from "@curatorjs/types";
import { Button, Input } from "@curatorjs/ui";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  PiArrowsClockwiseBold,
  PiSlidersHorizontal,
  PiSlidersHorizontalBold,
} from "react-icons/pi";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "react-use";

import LanguageSelect from "@/ui/LanguageSelect";

import FieldFilters from "./FieldFilters";

export default function FilterToolbar({
  contentType,
  onRefresh,
  loading,
}: {
  contentType: StrapiContentType;
  onRefresh: VoidFunction;
  loading: boolean;
}) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("_q") ?? "");

  useDebounce(
    () => {
      setSearchParams((params) => {
        search ? params.set("_q", search) : params.delete("_q");
        return params;
      });
    },
    500,
    [search],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-row justify-between items-center gap-4 flex-1 flex-wrap">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("filters.search")}
          className="sm:max-w-[260px]"
        />
        <div className="flex items-center gap-4 flex-1 justify-center sm:justify-end">
          {contentType.pluginOptions.i18n?.localized && (
            <div className="max-w-[180px] w-full">
              <LanguageSelect
                value={searchParams.get("locale")}
                onValueChange={async (locale) => {
                  setSearchParams((params) => {
                    params.set("locale", locale);
                    return params;
                  });
                }}
              />
            </div>
          )}
          <Button
            size="sm"
            loading={loading}
            variant="outline"
            onClick={onRefresh}
          >
            <PiSlidersHorizontalBold className="size-4 mr-2" />
            {t("View")}
          </Button>
        </div>
      </div>
      <FieldFilters />
    </div>
  );
}
