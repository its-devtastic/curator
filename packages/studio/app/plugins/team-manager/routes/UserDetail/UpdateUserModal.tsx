import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Input, Select, message } from "antd";
import { Formik, Field as FormikField } from "formik";
import * as Schema from "yup";
import * as R from "ramda";

import useStrapi from "@/hooks/useStrapi";
import FormField from "@/ui/FormField";
import Field from "@/ui/Field";
import { AdminUser } from "@/types/adminUser";

export default function UpdateUserModal({
  onClose,
  onUpdate,
  user,
}: {
  user: AdminUser;
  onClose?: VoidFunction;
  onUpdate?: VoidFunction;
}) {
  const { t } = useTranslation();
  const { sdk, roles, permissions } = useStrapi();
  const canEditRoles = permissions.some(
    R.whereEq({ action: "admin::roles.read" })
  );

  const validationSchema = Schema.object({
    firstname: Schema.string().required(),
    lastname: Schema.string().required(),
    email: Schema.string().email().required(),
    roles: canEditRoles ? Schema.array().min(1) : Schema.mixed(),
  });

  return (
    <Formik
      initialValues={
        R.pipe<any, any, any>(
          R.pick(["firstname", "lastname", "email", "roles", "isActive", "id"]),
          R.evolve({ roles: R.pluck("id") })
        )(user) as AdminUser & {
          roles: number[];
        }
      }
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        try {
          await sdk.updateAdminUser(values);

          onUpdate?.();
        } catch (e) {
          message.error(t("team.update_error"));
        }
      }}
    >
      {({ submitForm, isSubmitting, errors }) => (
        <Modal
          open
          centered
          title={t("team.update_user")}
          cancelText={t("common.cancel")}
          okText={t("common.save")}
          onCancel={onClose}
          onOk={submitForm}
          confirmLoading={isSubmitting}
        >
          <div className="py-12">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <FormField
                label={t("common.first_name")}
                error={errors.firstname}
              >
                <FormikField name="firstname" as={Input} />
              </FormField>
              <FormField label={t("common.last_name")} error={errors.lastname}>
                <FormikField name="lastname" as={Input} />
              </FormField>
              <FormField label={t("common.email")} error={errors.email}>
                <FormikField name="email" as={Input} type="email" />
              </FormField>
            </div>

            {canEditRoles && (
              <div>
                <h3 className="m-0 mb-3">{t("common.role_other")}</h3>
                <FormField
                  label={t("team.user_roles_label")}
                  help={t("team.user_roles_help")}
                  error={errors.roles as string}
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
            )}
          </div>
        </Modal>
      )}
    </Formik>
  );
}
