import React from "react";
import { Button, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import LanguageSelect from "@/ui/LanguageSelect";
import { StrapiContentType } from "@/types/contentType";

import FieldFilters from "./FieldFilters";

const FilterToolbar: React.FC<{
  contentType: StrapiContentType;
  onRefresh: VoidFunction;
}> = ({ contentType, onRefresh }) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex gap-4 items-center">
        <Input.Search
          onSearch={async (_q) => {
            setSearchParams({ _q });
          }}
          defaultValue={searchParams.get("_q") ?? ""}
          placeholder={t("filters.search")}
        />
        <FieldFilters />
      </div>
      <div className="flex items-center gap-2">
        {contentType.pluginOptions.i18n?.localized && (
          <LanguageSelect
            className="w-48"
            value={searchParams.get("locale")}
            onChange={async (locale) => {
              setSearchParams({ locale });
            }}
          />
        )}
        <Button
          type="text"
          icon={<FontAwesomeIcon icon={faRefresh} />}
          onClick={onRefresh}
        />
      </div>
    </div>
  );
};

export default FilterToolbar;
