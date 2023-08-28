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
  loading: boolean;
}> = ({ contentType, onRefresh, loading }) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <Input.Search
        onSearch={async (_q) => {
          setSearchParams((params) => {
            params.set("_q", _q);
            return params;
          });
        }}
        defaultValue={searchParams.get("_q") ?? ""}
        allowClear
        placeholder={t("filters.search")}
      />
      <FieldFilters />
      {contentType.pluginOptions.i18n?.localized && (
        <LanguageSelect
          className="w-48"
          value={searchParams.get("locale")}
          onChange={async (locale) => {
            setSearchParams((params) => {
              params.set("locale", locale);
              return params;
            });
          }}
        />
      )}
      <Button
        loading={loading}
        type="text"
        icon={<FontAwesomeIcon icon={faRefresh} />}
        onClick={onRefresh}
      />
    </div>
  );
};

export default FilterToolbar;
