import React from "react";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { Button, Card, Input } from "antd";

import useSession from "~/hooks/useSession";
import useStrapi from "~/hooks/useStrapi";

import Spinner from "~/ui/Spinner";
import Field from "~/ui/Field";
import FormField from "~/ui/FormField";
import LocaleSelect from "~/ui/LocaleSelect";

export default function Profile() {
  const { user, setSession } = useSession();
  const { t } = useTranslation();
  const { sdk } = useStrapi();

  return (
    <div>
      {user ? (
        <Formik
          initialValues={{
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            preferedLanguage: user.preferedLanguage,
          }}
          onSubmit={async (values) => {
            try {
              const user = await sdk.updateProfile(values);
              setSession({ user });
            } catch (e) {}
          }}
        >
          {() => (
            <Form>
              <div className="flex items-center justify-between mb-12 pb-6 border-b border-0 border-solid border-gray-200">
                <h1 className="m-0">{t("common.profile")}</h1>
                <Button type="primary" htmlType="submit">
                  {t("common.save")}
                </Button>
              </div>
              <div className="space-y-3">
                <Card>
                  <div className="space-y-3 max-w-lg">
                    <FormField label={t("profile.email")}>
                      <Field name="email">
                        <Input type="email" />
                      </Field>
                    </FormField>
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <FormField label={t("profile.firstname")}>
                          <Field name="firstname">
                            <Input />
                          </Field>
                        </FormField>
                      </div>
                      <div className="flex-1">
                        <FormField label={t("profile.lastname")}>
                          <Field name="lastname">
                            <Input />
                          </Field>
                        </FormField>
                      </div>
                    </div>
                    <FormField label={t("profile.username")}>
                      <Field name="username">
                        <Input />
                      </Field>
                    </FormField>
                  </div>
                </Card>

                <Card>
                  <div className="max-w-lg">
                    <FormField label={t("profile.interfaceLanguage")}>
                      <Field name="preferedLanguage">
                        <LocaleSelect />
                      </Field>
                    </FormField>
                  </div>
                </Card>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
