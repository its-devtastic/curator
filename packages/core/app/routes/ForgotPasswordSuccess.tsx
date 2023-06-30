import React from "react";
import { Link } from "react-router-dom";
import { Card } from "antd";
import { useTranslation } from "react-i18next";

import useCurator from "~/hooks/useCurator";

const ForgotPasswordSuccess: React.FC = () => {
  const { t } = useTranslation();
  const { icon } = useCurator();

  return (
    <div className="max-w-sm w-full">
      <div className="text-center mb-6">
        <img src={icon} alt="" className="h-16" />
      </div>
      <h1 className="text-center mb-12 mt-6 select-none">
        {t("forgot_password_success.title")}
      </h1>
      <div className="text-center">
        {t("forgot_password_success.description")}
      </div>
      <div className="text-center my-6">
        <Link to="/login" className="text-sm no-underline text-blue-500">
          {t("forgot_password.ready")}
        </Link>
      </div>
    </div>
  );
};
export default ForgotPasswordSuccess;
