import React, { useState } from "react";
import { Button, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

import LanguageSelect from "~/ui/LanguageSelect";
import { StrapiContentType } from "~/types/contentType";

const FilterToolbar: React.FC<{ contentType: StrapiContentType }> = ({
  contentType,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<false | "button" | "search">(false);
  const { setFieldValue, values, submitForm } = useFormikContext<any>();

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex gap-4 items-center">
        <Input.Search
          loading={loading === "search"}
          onSearch={async (_q) => {
            setFieldValue("_q", _q);
            setLoading("search");
            await submitForm();
            setLoading(false);
          }}
          placeholder={t("filters.search")}
        />
      </div>
      <div className="flex items-center gap-2">
        {contentType.pluginOptions.localized && (
          <LanguageSelect
            className="w-48"
            value={values.locale}
            onChange={async (locale) => {
              await setFieldValue("locale", locale);
              await submitForm();
            }}
          />
        )}
        <Button
          loading={loading === "button"}
          type="text"
          icon={<FontAwesomeIcon icon={faRefresh} />}
          onClick={async () => {
            setLoading("button");
            await submitForm();
            setLoading(false);
          }}
        />
      </div>
    </div>
  );
};

export default FilterToolbar;
