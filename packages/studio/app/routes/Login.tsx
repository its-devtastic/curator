import React from "react";
import { Formik, Form, Field } from "formik";
import { Button, Input, message } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import useStrapi from "@/hooks/useStrapi";
import useSession from "@/hooks/useSession";
import useCurator from "@/hooks/useCurator";
import FormField from "@/ui/FormField";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { sdk } = useStrapi();
  const { about } = useCurator();
  const { setSession } = useSession();

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
        {t("login.title")}
      </h1>
      <div className="p-6 rounded-lg shadow-xl shadow-indigo-500/5 bg-white/60 backdrop-blur-xl">
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
                    <Link to="/forgot-password" className="link">
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
      </div>
    </div>
  );
};
export default Login;
