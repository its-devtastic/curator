import React from "react";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { Avatar, Button, Card, Input } from "antd";
import toColor from "string-to-color";

import useSession from "@/hooks/useSession";
import useStrapi from "@/hooks/useStrapi";

import Spinner from "@/ui/Spinner";
import Field from "@/ui/Field";
import FormField from "@/ui/FormField";
import LocaleSelect from "@/ui/LocaleSelect";
import { MediaLibraryPopover } from "@/plugins/media-library";
import Popover from "@/ui/Popover";

export default function Profile() {
  const { user, profile, setSession } = useSession();
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
          {({ values }) => (
            <Form className="px-4 md:px-12">
              <div className="flex items-center justify-between my-12">
                <h1 className="m-0 font-serif font-normal">
                  {t("common.profile")}
                </h1>
                <Button type="primary" htmlType="submit">
                  {t("common.save")}
                </Button>
              </div>
              <div className="max-w-lg p-8 shadow-sm border border-solid border-gray-200 rounded-lg">
                <div className="space-y-3">
                  <div className="flex flex-col items-center mb-12">
                    <Popover
                      trigger={["click"]}
                      content={(close) => (
                        <MediaLibraryPopover
                          mime="image"
                          onChange={async (item) => {
                            const profile = await sdk.updateExtendedProfile({
                              avatar: item,
                            });
                            setSession({ profile });
                            close();
                          }}
                        />
                      )}
                    >
                      <Avatar
                        className="h-32 w-32 text-5xl flex items-center justify-center cursor-pointer"
                        alt={values.firstname}
                        style={{
                          backgroundColor: !profile?.avatar?.url
                            ? toColor(user.email)
                            : undefined,
                        }}
                        src={profile?.avatar?.url}
                      >
                        {(
                          user.username?.[0] ||
                          user.firstname?.[0] ||
                          user.email[0]
                        ).toUpperCase()}
                      </Avatar>
                    </Popover>
                  </div>
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
                  <FormField label={t("profile.interfaceLanguage")}>
                    <Field name="preferedLanguage">
                      <LocaleSelect />
                    </Field>
                  </FormField>
                </div>
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
