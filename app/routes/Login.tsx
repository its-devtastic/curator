import React from "react";

import { Formik, Form, Field } from "formik";
import { Button, Card, Input, message } from "antd";
import { useTranslation } from "react-i18next";

import useStrapi from "~/hooks/useStrapi";
import useSession from "~/hooks/useSession";
import useStrapion from "~/hooks/useStrapion";
import FormField from "~/ui/FormField";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { sdk } = useStrapi();
  const { icon } = useStrapion();
  const { setSession } = useSession();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="max-w-sm w-full">
        <div className="text-center mb-6">
          <img src={icon} alt="" className="h-16" />
        </div>
        <Card className="shadow-[0_3px_0] shadow-slate-100">
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
                    {t("login.login_button")}
                  </Button>
                </Form>
              )}
            </Formik>
          }
        </Card>
      </div>
    </div>
  );
};
export default Login;
