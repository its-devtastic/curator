import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import useCurator from "@/hooks/useCurator";

const ForgotPasswordSuccess: React.FC = () => {
  const { t } = useTranslation();
  const { about } = useCurator();

  return (
    <div className="max-w-sm w-full">
      {about?.icon && (
        <div className="text-center mb-6">
          <img
            src={typeof about.icon === "string" ? about.icon : about.icon.auth}
            alt=""
            className="h-16"
          />
        </div>
      )}
      <h1 className="text-center mb-12 mt-6 select-none font-serif font-normal">
        {t("forgot_password_success.title")}
      </h1>
      <div className="text-center">
        {t("forgot_password_success.description")}
      </div>
      <div className="text-center my-6">
        <Link to="/login" className="link">
          {t("forgot_password.ready")}
        </Link>
      </div>
    </div>
  );
};
export default ForgotPasswordSuccess;
