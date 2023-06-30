import React from "react";

import { Formik, Form, Field } from "formik";
import { Button, Card, Input, message } from "antd";
import { useTranslation } from "react-i18next";

import useStrapi from "~/hooks/useStrapi";
import useSession from "~/hooks/useSession";
import useCurator from "~/hooks/useCurator";
import FormField from "~/ui/FormField";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { sdk } = useStrapi();
  const { icon } = useCurator();
  const { setSession } = useSession();

  return (
    <div className="max-w-sm w-full">
      {icon && (
        <div className="text-center mb-6">
          <img
            src={typeof icon === "string" ? icon : icon.auth}
            alt=""
            className="h-16"
          />
        </div>
      )}
      <h1 className="text-center mb-12 mt-6 select-none">{t("login.title")}</h1>
      <Card className="shadow-lg shadow-gray-200/50 border-gray-300">
        {
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={async (credentials) => {
              try {
                const data = await sdk.login(credentials);
                setSession(data);
              } catch (e: any) {
                message.error(e.response.data.error.message);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <FormField label={t("login.email")}>
                  <Field name="email" as={Input} type="email" />
                </FormField>
                <FormField
                  label={t("login.password")}
                  help={
                    <Link to="/forgot-password">
                      {t("login.forgot_password")}
                    </Link>
                  }
                >
                  <Field name="password" as={Input.Password} />
                </FormField>
                <Button
                  type="primary"
                  className="w-full"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  {t("login.button")}
                </Button>
              </Form>
            )}
          </Formik>
        }
      </Card>
    </div>
  );
};
export default Login;
