import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { Button, Card, Input, message } from "antd";
import { useTranslation } from "react-i18next";
import * as Schema from "yup";

import useStrapi from "@/hooks/useStrapi";
import useCurator from "@/hooks/useCurator";
import FormField from "@/ui/FormField";
import useSession from "@/hooks/useSession";

const ResetPassword: React.FC = () => {
  const { t } = useTranslation();
  const { sdk } = useStrapi();
  const { icon } = useCurator();
  const { setSession } = useSession();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const validationSchema = Schema.object({
    password: Schema.string().required().min(8),
    confirmPassword: Schema.string()
      .required()
      .oneOf([Schema.ref("password")]),
  });

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
      <h1 className="text-center mb-12 mt-6 select-none">
        {t("reset_password.title")}
      </h1>
      <Card className="shadow-[0_3px_0] shadow-gray-100">
        {code ? (
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            validateOnMount
            onSubmit={async ({ password }) => {
              try {
                const data = await sdk.resetPassword({ password, code });
                setSession(data);
              } catch (e: any) {
                message.error(t("reset_password.error"));
              }
            }}
          >
            {({ isSubmitting, isValid }) => (
              <Form className="space-y-4">
                <FormField
                  label={t("reset_password.password")}
                  help={t("reset_password.requirements")}
                >
                  <Field name="password" as={Input.Password} />
                </FormField>
                <FormField label={t("reset_password.confirm_password")}>
                  <Field name="confirmPassword" as={Input.Password} />
                </FormField>
                <Button
                  type="primary"
                  className="w-full"
                  htmlType="submit"
                  loading={isSubmitting}
                  disabled={!isValid}
                >
                  {t("reset_password.button")}
                </Button>
              </Form>
            )}
          </Formik>
        ) : (
          <div>{t("reset_password.no_code")}</div>
        )}
      </Card>
      <div className="text-center my-6">
        <Link to="/login" className="text-sm no-underline text-blue-500">
          {t("reset_password.ready")}
        </Link>
      </div>
    </div>
  );
};
export default ResetPassword;
