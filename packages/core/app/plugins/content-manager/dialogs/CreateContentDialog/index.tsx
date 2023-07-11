import React from "react";
import { Modal, notification } from "antd";
import { useTranslation } from "react-i18next";
import * as R from "ramda";
import { Formik, Form } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

import { Entity } from "~/types/content";
import useCurator from "~/hooks/useCurator";
import useStrapi from "~/hooks/useStrapi";
import useSecrets from "~/hooks/useSecrets";

import { usePluginOptions } from "../../hooks";
import FieldRenderer from "../../ui/FieldRenderer";

export default function CreateContentDialog({
  apiID,
  onCreate,
  onCancel,
}: CreateContentDialogProps) {
  const { t } = useTranslation();
  const config = useCurator();
  const { contentTypes, sdk } = useStrapi();
  const contentTypeConfig = config.contentTypes?.find(R.whereEq({ apiID }));
  const contentType = contentTypes.find(R.whereEq({ apiID }));
  const pluginOptions = usePluginOptions(
    (state) => state.options.contentTypes?.[apiID]
  );
  const { getSecret } = useSecrets();

  return contentTypeConfig && contentType ? (
    <Formik<Partial<Entity>>
      initialValues={{}}
      onSubmit={async (values) => {
        try {
          const data = await sdk.save(apiID, values, {
            params: { "plugins[i18n][locale]": values.locale },
          });
          const hooks =
            config.hooks?.filter(R.whereEq({ trigger: "create" })) ?? [];

          for (const hook of hooks) {
            hook.action(apiID, data, { getSecret });
          }

          onCreate?.(data);
        } catch (e) {
          notification.error({ message: "Oops" });
        }
      }}
    >
      {({ submitForm, isSubmitting }) => (
        <Modal
          open
          onCancel={onCancel}
          onOk={submitForm}
          confirmLoading={isSubmitting}
          closeIcon={<FontAwesomeIcon icon={faClose} />}
          maskClosable={false}
          okText={t("common.create")}
          cancelText={t("common.cancel")}
          title={`${t("phrases.create_new")} ${t(
            contentTypeConfig.name ?? contentType.info.displayName,
            {
              ns: "custom",
            }
          ).toLowerCase()}`}
        >
          <Form>
            <div className="space-y-6 py-12">
              {pluginOptions?.create?.main?.map((field) => (
                <FieldRenderer
                  key={field.path}
                  apiID={apiID}
                  field={
                    contentTypeConfig.fields.find(
                      R.whereEq({ path: field.path })
                    )!
                  }
                  attribute={contentType.attributes[field.path]}
                />
              ))}
            </div>
          </Form>
        </Modal>
      )}
    </Formik>
  ) : null;
}

interface CreateContentDialogProps {
  apiID: string;
  onCreate?(document: Entity): void;
  onCancel?: VoidFunction;
}
