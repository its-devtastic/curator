import { Input } from "@curatorjs/ui";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "react-use";

const FilterToolbar: React.FC = () => {
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
    <div className="flex justify-between items-center">
      <div className="flex gap-1 items-center">
        <Input
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder={t("filters.search")}
        />
      </div>
      <div className="flex items-center gap-2"></div>
    </div>
  );
};

export default FilterToolbar;
