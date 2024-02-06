import { Input, Modal, Select } from "antd";
import { Formik } from "formik";
import * as R from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";
import { useAsync } from "react-use";

import useStrapi from "@/hooks/useStrapi";
import Field from "@/ui/Field";
import FormField from "@/ui/FormField";

export default function SecretsForm({
  item,
  onClose,
}: {
  item: any;
  onClose: VoidFunction;
}) {
  const { t } = useTranslation();
  const { sdk, roles } = useStrapi();
  const isCreate = !item.id;

  const { value: roleIds } = useAsync(async () => {
    if (!isCreate) {
      return sdk.getRelations("curator-secret", item.id, "roles");
    }
  }, [sdk, isCreate]);

  return (
    (isCreate || roleIds) && (
      <Formik
        initialValues={
          isCreate
            ? { key: "", value: "", roles: [] }
            : { ...item, roles: roleIds?.results.map(({ id }) => id) }
        }
        onSubmit={async (values) => {
          try {
            await sdk.save("curator-secret", values);
            onClose();
          } catch (e) {
            console.error(e);
          }
        }}
      >
        {({ submitForm, values }) => (
          <Modal
            open
            title={isCreate ? t("common.create") : t("common.update")}
            okText={isCreate ? t("common.create") : t("common.update")}
            okButtonProps={{
              disabled: !values.value || !values.key || R.isEmpty(values.roles),
            }}
            cancelText={t("common.cancel")}
            onOk={submitForm}
            onCancel={onClose}
          >
            <div className="space-y-4 my-8">
              <FormField label={t("secrets.key")}>
                <Field name="key">
                  <Input placeholder="SECRET_KEY" />
                </Field>
              </FormField>
              <FormField label={t("secrets.value")}>
                <Field name="value">
                  <Input.TextArea />
                </Field>
              </FormField>
              <FormField
                label={t("secrets.roles")}
                help={t("secrets.roles_help")}
              >
                <Field name="roles">
                  <Select
                    mode="multiple"
                    className="w-full"
                    options={roles
                      // Super admins always have access
                      .filter(({ code }) => code !== "strapi-super-admin")
                      .map((role) => ({
                        label: role.name,
                        value: role.id,
                      }))}
                  />
                </Field>
              </FormField>
            </div>
          </Modal>
        )}
      </Formik>
    )
  );
}
