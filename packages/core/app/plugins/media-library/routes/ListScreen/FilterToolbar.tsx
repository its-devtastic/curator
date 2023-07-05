import React, { useState } from "react";
import { Button, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

const FilterToolbar: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<false | "button" | "search">(false);
  const { setFieldValue, submitForm } = useFormikContext<any>();

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4 items-center">
        <Input.Search
          allowClear
          loading={loading === "search"}
          onSearch={async (_q) => {
            await setFieldValue("_q", _q);
            setLoading("search");
            await submitForm();
            setLoading(false);
          }}
          placeholder={t("filters.search")}
        />
      </div>
      <div className="flex items-center gap-2">
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
