import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Input,
  Select,
  message,
  Typography,
  Result,
  Button,
} from "antd";
import { Formik, Field as FormikField } from "formik";
import * as Schema from "yup";

import useStrapi from "@/hooks/useStrapi";
import FormField from "@/ui/FormField";
import Field from "@/ui/Field";
import { AdminUser } from "@curatorjs/types";

export default function InviteUserModal({
  onClose,
  onCreate,
}: {
  onClose?: VoidFunction;
  onCreate?: VoidFunction;
}) {
  const { t } = useTranslation();
  const { sdk, roles } = useStrapi();
  const [user, setUser] = useState<
    (AdminUser & { registrationToken: string }) | null
  >(null);

  const validationSchema = Schema.object({
    firstname: Schema.string().required(),
    lastname: Schema.string().required(),
    email: Schema.string().email().required(),
    roles: Schema.array().min(1),
  });

  return (
    <Formik
      initialValues={{ firstname: "", lastname: "", email: "", roles: [] }}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        try {
          const user = await sdk.createAdminUser(values);
          setUser(user);
        } catch (e) {
          message.error(t("team.error"));
        }
      }}
    >
      {({ submitForm, isSubmitting, errors, touched }) => (
        <Modal
          open
          centered
          footer={user ? null : undefined}
          title={!user && t("team.invite")}
          cancelText={t("common.cancel")}
          okText={t("team.send_invite")}
          onCancel={onClose}
          onOk={submitForm}
          confirmLoading={isSubmitting}
        >
          {user ? (
            <div>
              <Result
                status="success"
                title={t("team.copy_link", {
                  name: user.firstname,
                })}
                subTitle={
                  <Typography.Text
                    copyable
                    className="font-mono font-semibold text-indigo-500"
                  >
                    {`${window.location.origin}/register?registrationToken=${user.registrationToken}`}
                  </Typography.Text>
                }
                extra={[
                  <Button key="done" onClick={onCreate}>
                    {t("common.done")}
                  </Button>,
                ]}
              />
            </div>
          ) : (
            <div className="py-12">
              <div className="grid grid-cols-2 gap-3 mb-6">
                <FormField
                  label={t("common.first_name")}
                  error={touched.firstname && errors.firstname}
                >
                  <FormikField name="firstname" as={Input} />
                </FormField>
                <FormField
                  label={t("common.last_name")}
                  error={touched.lastname && errors.lastname}
                >
                  <FormikField name="lastname" as={Input} />
                </FormField>
                <FormField
                  label={t("common.email")}
                  error={touched.email && errors.email}
                >
                  <FormikField name="email" as={Input} type="email" />
                </FormField>
              </div>

              <div>
                <h3 className="m-0 mb-3">{t("common.role_other")}</h3>
                <FormField
                  label={t("team.user_roles_label")}
                  help={t("team.user_roles_help")}
                  error={touched.roles && errors.roles}
                >
                  <Field name="roles">
                    <Select
                      mode="multiple"
                      className="w-full"
                      options={roles.map((role) => ({
                        label: role.name,
                        value: role.id,
                      }))}
                    />
                  </Field>
                </FormField>
              </div>
            </div>
          )}
        </Modal>
      )}
    </Formik>
  );
}
