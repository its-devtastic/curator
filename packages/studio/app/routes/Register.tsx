import { Button, Card, Input, message } from "antd";
import { Field, Form, Formik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAsync } from "react-use";

import useCurator from "@/hooks/useCurator";
import useSession from "@/hooks/useSession";
import useStrapi from "@/hooks/useStrapi";
import FormField from "@/ui/FormField";

const Register: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { sdk } = useStrapi();
  const {
    about: { icon },
  } = useCurator();
  const { setSession } = useSession();
  const registrationToken = searchParams.get("registrationToken");

  const { value: registrationInfo } = useAsync(async () => {
    if (!registrationToken) {
      return;
    }

    try {
      return await sdk.getRegistrationInfo(registrationToken);
    } catch (e: any) {
      if (e.response.status) {
        navigate("/login", { replace: true });
        message.error(t("register.invalid_token"));
      }
    }
  }, [registrationToken]);

  return registrationInfo && registrationToken ? (
    <div className="max-w-md w-full">
      {icon && (
        <div className="text-center mb-6">
          <img
            src={typeof icon === "string" ? icon : icon.auth}
            alt=""
            className="h-16"
          />
        </div>
      )}
      <div className="p-6 rounded-lg shadow-xl shadow-indigo-500/5 bg-white/60 backdrop-blur-xl">
        <h1 className="mt-0 mb-6 text-center font-serif font-normal">
          {t("register.title")}
        </h1>
        {
          <Formik
            initialValues={{
              email: registrationInfo.email ?? "",
              firstname: registrationInfo.firstname ?? "",
              lastname: registrationInfo.lastname ?? "",
              password: "",
            }}
            onSubmit={async ({ email, ...userInfo }) => {
              try {
                const data = await sdk.register({
                  registrationToken,
                  ...userInfo,
                });
                setSession(data);
              } catch (e: any) {
                message.error(e.response.data.error.message);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <FormField label={t("register.first_name")}>
                      <Field name="firstname" as={Input} />
                    </FormField>
                  </div>
                  <div className="flex-1">
                    <FormField label={t("register.last_name")}>
                      <Field name="lastname" as={Input} />
                    </FormField>
                  </div>
                </div>
                <FormField label={t("register.email")}>
                  <Field name="email" as={Input} type="email" disabled />
                </FormField>
                <FormField
                  label={t("register.password")}
                  help={t("register.password_requirements")}
                >
                  <Field name="password" as={Input.Password} />
                </FormField>
                <Button
                  type="primary"
                  className="w-full"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  {t("register.register_button")}
                </Button>
                <div className="text-center">
                  <Link to="/login">{t("register.already_account")}</Link>
                </div>
              </Form>
            )}
          </Formik>
        }
      </div>
    </div>
  ) : null;
};
export default Register;
