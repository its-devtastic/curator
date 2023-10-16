import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { Button, Input, message } from "antd";
import { useTranslation } from "react-i18next";

import useStrapi from "@/hooks/useStrapi";
import useCurator from "@/hooks/useCurator";
import FormField from "@/ui/FormField";

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const { sdk } = useStrapi();
  const { about } = useCurator();
  const navigate = useNavigate();

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
        {t("forgot_password.title")}
      </h1>
      <div className="p-6 rounded-lg shadow-xl shadow-indigo-500/5 bg-white/60 backdrop-blur-xl">
        {
          <Formik
            initialValues={{ email: "" }}
            onSubmit={async ({ email }) => {
              try {
                const data = await sdk.forgotPassword(email);
                navigate("/forgot-password-success");
              } catch (e: any) {
                message.error(e.response.data.error.message);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <FormField label={t("forgot_password.email")}>
                  <Field name="email" as={Input} type="email" />
                </FormField>
                <Button
                  type="primary"
                  className="w-full"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  {t("forgot_password.button")}
                </Button>
              </Form>
            )}
          </Formik>
        }
      </div>
      <div className="text-center my-6">
        <Link to="/login" className="text-sm no-underline text-blue-500">
          {t("forgot_password.ready")}
        </Link>
      </div>
    </div>
  );
};
export default ForgotPassword;
