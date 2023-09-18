import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Button,
  Input,
  message,
  Modal,
  Radio,
  Result,
  Typography,
} from "antd";
import { Form, Formik } from "formik";
import * as R from "ramda";
import dayjs from "dayjs";

import { ApiToken } from "@/types/apiToken";
import useStrapi from "@/hooks/useStrapi";
import Field from "@/ui/Field";
import FormField from "@/ui/FormField";

import PermissionsSelect from "./PermissionsSelect";

const ApiTokenForm: React.FC<{
  item: ApiToken | { id: null };
  onClose: VoidFunction;
}> = ({ item, onClose }) => {
  const { t } = useTranslation();
  const { sdk, permissions } = useStrapi();
  const [accessKey, setAccessKey] = useState<string | null>(null);
  const [modal, contextHolder] = Modal.useModal();

  return (
    <>
      {contextHolder}
      <Formik<
        Pick<
          ApiToken,
          "name" | "description" | "lifespan" | "type" | "permissions"
        > & { id: number | null }
      >
        initialValues={
          item.id
            ? item
            : {
                id: null,
                name: "",
                description: "",
                lifespan: String(7 * 24 * 60 * 60 * 1_000),
                type: "read-only",
                permissions: null,
              }
        }
        onSubmit={async (values) => {
          try {
            if (values.id) {
              await sdk.updateApiToken(values.id, values);
              onClose();
            } else {
              const { accessKey } = await sdk.createApiToken(
                R.evolve({
                  lifespan: R.ifElse(R.isEmpty, R.always(null), Number),
                })(values),
              );
              setAccessKey(accessKey);
            }
          } catch (e: any) {
            message.error(e.message);
          }
        }}
      >
        {({ values, submitForm, isSubmitting }) => (
          <Modal
            open
            title={
              accessKey
                ? ""
                : item.id
                ? item.name
                : t("api_tokens.create_api_token")
            }
            closeIcon={!accessKey}
            onCancel={onClose}
            onOk={submitForm}
            cancelText={t("common.cancel")}
            okText={item.id ? t("common.update") : t("common.create")}
            footer={
              accessKey ? (
                <Button onClick={onClose}>{t("common.done")}</Button>
              ) : undefined
            }
            okButtonProps={{ ghost: !R.isNil(item.id) }}
            confirmLoading={isSubmitting}
          >
            {!accessKey ? (
              <Form className="py-8 space-y-4">
                {item.id && (
                  <Alert
                    type="warning"
                    icon={<span>🔐</span>}
                    showIcon
                    message={t("api_tokens.token_not_accessible_anymore")}
                    action={
                      <Button
                        size="small"
                        onClick={() => {
                          modal.confirm({
                            title: t("phrases.are_you_sure"),
                            content: t("api_tokens.confirm_regeneration"),
                            cancelText: t("common.cancel"),
                            okText: t("api_tokens.regenerate"),
                            okButtonProps: { danger: true },
                            onOk: async () => {
                              try {
                                const accessKey = await sdk.regenerateApiToken(
                                  item.id,
                                );
                                setAccessKey(accessKey);
                              } catch (e) {}
                            },
                          });
                        }}
                      >
                        {t("api_tokens.regenerate")}
                      </Button>
                    }
                  />
                )}
                <FormField label={t("common.name")}>
                  <Field name="name">
                    <Input />
                  </Field>
                </FormField>
                <FormField label={t("common.description")}>
                  <Field name="description">
                    <Input.TextArea />
                  </Field>
                </FormField>
                <FormField
                  label={t("api_tokens.lifespan")}
                  help={
                    item.id &&
                    item.expiresAt &&
                    `${t("api_tokens.expires_at")} ${dayjs(
                      item.expiresAt,
                    ).format("l LT")}`
                  }
                >
                  <Field name="lifespan">
                    <Radio.Group
                      buttonStyle="solid"
                      optionType="button"
                      disabled={!R.isNil(item.id)}
                      options={[
                        {
                          label: t("api_tokens.lifespan_days", { days: 7 }),
                          value: String(7 * 24 * 60 * 60 * 1_000),
                        },
                        {
                          label: t("api_tokens.lifespan_days", { days: 30 }),
                          value: String(30 * 24 * 60 * 60 * 1_000),
                        },
                        {
                          label: t("api_tokens.lifespan_days", { days: 90 }),
                          value: String(90 * 24 * 60 * 60 * 1_000),
                        },
                        {
                          label: t("api_tokens.unlimited"),
                          value: "",
                        },
                      ]}
                    />
                  </Field>
                </FormField>
                <FormField label={t("common.permissions")}>
                  <Field name="type">
                    <Radio.Group
                      options={[
                        {
                          label: t("api_tokens.read_only"),
                          value: "read-only",
                        },
                        {
                          label: t("api_tokens.full_access"),
                          value: "full-access",
                        },
                        {
                          label: t("api_tokens.custom"),
                          value: "custom",
                        },
                      ]}
                    />
                  </Field>
                </FormField>

                {values.type === "custom" && (
                  <Field name="permissions">
                    <PermissionsSelect />
                  </Field>
                )}
              </Form>
            ) : (
              <div>
                <Result
                  icon={<span className="text-5xl">🔑</span>}
                  title={t("api_tokens.generated_title")}
                  subTitle={t("api_tokens.generated_description")}
                >
                  <div className="font-mono">
                    <Typography.Text copyable>{accessKey}</Typography.Text>
                  </div>
                </Result>
              </div>
            )}
          </Modal>
        )}
      </Formik>
    </>
  );
};

export default ApiTokenForm;
