import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Button, Input, message, Modal, Space } from "antd";
import { Form, Formik } from "formik";
import * as R from "ramda";

import { Webhook } from "@/types/webhook";
import useStrapi from "@/hooks/useStrapi";
import Field from "@/ui/Field";
import FormField from "@/ui/FormField";

import EventSelect from "./EventSelect";

const WebhookForm: React.FC<{
  item: Webhook | { id: null };
  onClose: VoidFunction;
}> = ({ item, onClose }) => {
  const { t } = useTranslation();
  const { sdk, permissions } = useStrapi();
  const [testResults, setTestResults] = useState<{
    message: string;
    statusCode: number;
  } | null>(null);

  return (
    <>
      <Formik<
        Pick<Webhook, "name" | "events" | "headers" | "url" | "isEnabled"> & {
          id: number | null;
        }
      >
        initialValues={
          item.id
            ? item
            : {
                id: null,
                name: "",
                events: [],
                headers: {},
                url: "",
                isEnabled: true,
              }
        }
        onSubmit={async (values) => {
          try {
            if (values.id) {
              await sdk.updateWebhook(values.id, values as Webhook);
            } else {
              await sdk.createWebhook(values);
            }
            onClose();
          } catch (e: any) {
            message.error(e.message);
          }
        }}
      >
        {({ values, submitForm, isSubmitting }) => (
          <Modal
            open
            title={item.id ? item.name : t("webhooks.create_webhook")}
            onCancel={onClose}
            onOk={submitForm}
            cancelText={t("common.cancel")}
            okText={item.id ? t("common.update") : t("common.create")}
            okButtonProps={{ ghost: !R.isNil(item.id) }}
            confirmLoading={isSubmitting}
          >
            {
              <Form className="py-8 space-y-4">
                {testResults && (
                  <Alert
                    type={testResults.statusCode >= 400 ? "error" : "success"}
                    icon={testResults.statusCode >= 400 ? "" : ""}
                    showIcon
                    description={testResults.message}
                    message={testResults.statusCode}
                  />
                )}
                <FormField label={t("common.name")}>
                  <Field name="name">
                    <Input />
                  </Field>
                </FormField>
                <FormField label={t("common.url")}>
                  <Space.Compact className="w-full">
                    <Field name="url">
                      <Input placeholder="http://" />
                    </Field>
                    {item.id && (
                      <Button
                        onClick={async () => {
                          try {
                            const result = await sdk.triggerWebhook(item.id);
                            setTestResults(result);
                          } catch (e) {}
                        }}
                      >
                        {t("common.test")}
                      </Button>
                    )}
                  </Space.Compact>
                </FormField>
                <FormField label={t("common.events")}>
                  <Field name="events">
                    <EventSelect />
                  </Field>
                </FormField>
              </Form>
            }
          </Modal>
        )}
      </Formik>
    </>
  );
};

export default WebhookForm;
