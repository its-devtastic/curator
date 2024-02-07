import { Alert, Button } from "@curatorjs/ui";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import useCurator from "@/hooks/useCurator";

const ForgotPasswordSuccess: React.FC = () => {
  const { t } = useTranslation();
  const { about } = useCurator();

  return (
    <div className="max-w-sm w-full">
      {about?.icon && (
        <div className="mb-6">
          <img
            src={typeof about.icon === "string" ? about.icon : about.icon.auth}
            alt=""
            className="h-16 mx-auto"
          />
        </div>
      )}
      <h1 className="text-center mb-12 mt-6 select-none text-2xl font-bold">
        {t("forgot_password_success.title")}
      </h1>
      <Alert className="text-center">
        {t("forgot_password_success.description")}
      </Alert>
      <div className="text-center my-6">
        <Button asChild>
          <Link to="/login">{t("forgot_password.ready")}</Link>
        </Button>
      </div>
    </div>
  );
};
export default ForgotPasswordSuccess;
