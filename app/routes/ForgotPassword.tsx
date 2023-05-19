import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { Button, Card, Input, message } from "antd";
import { useTranslation } from "react-i18next";

import useStrapi from "~/hooks/useStrapi";
import useStrapion from "~/hooks/useStrapion";
import FormField from "~/ui/FormField";

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const { sdk } = useStrapi();
  const { icon } = useStrapion();
  const navigate = useNavigate();

  return (
    <div className="max-w-sm w-full">
      <div className="text-center mb-6">
        <img src={icon} alt="" className="h-16" />
      </div>
      <h1 className="text-center mb-12 mt-6 select-none">
        {t("forgot_password.title")}
      </h1>
      <Card className="shadow-[0_3px_0] shadow-slate-100">
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
      </Card>
      <div className="text-center my-6">
        <Link to="/login" className="text-sm no-underline text-blue-500">
          {t("forgot_password.ready")}
        </Link>
      </div>
    </div>
  );
};
export default ForgotPassword;
