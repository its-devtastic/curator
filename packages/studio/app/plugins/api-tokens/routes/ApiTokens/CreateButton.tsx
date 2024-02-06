import { Button } from "antd";
import * as R from "ramda";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import useStrapi from "@/hooks/useStrapi";

import ApiTokenForm from "./ApiTokenForm";

const CreateButton: React.FC<{ onCreate: VoidFunction }> = ({ onCreate }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState(false);
  const { permissions } = useStrapi();
  const canCreate = permissions.some(
    R.whereEq({ action: "admin::api-tokens.create" }),
  );

  return canCreate ? (
    <>
      <Button type="primary" onClick={() => setForm(true)}>
        {t("api_tokens.create_api_token")}
      </Button>
      {form && (
        <ApiTokenForm
          item={{ id: null }}
          onClose={() => {
            setForm(false);
            onCreate();
          }}
        />
      )}
    </>
  ) : null;
};

export default CreateButton;
