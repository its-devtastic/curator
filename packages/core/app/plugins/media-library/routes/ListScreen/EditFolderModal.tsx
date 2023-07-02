import React from "react";
import { MediaFolder } from "~/types/media";
import { Input, Modal } from "antd";
import { Field, Formik } from "formik";
import { useTranslation } from "react-i18next";

import FormField from "~/ui/FormField";
import useStrapi from "~/hooks/useStrapi";

export default function EditFolderModal({
  folder,
  onCancel,
  onSave,
}: {
  folder: MediaFolder;
  onCancel?: VoidFunction;
  onSave?: VoidFunction;
}) {
  const { t } = useTranslation();
  const { sdk } = useStrapi();

  return (
    <Formik
      initialValues={folder}
      onSubmit={async ({ id, name }) => {
        try {
          await sdk.updateFolder({ id, name });
          onSave?.();
        } catch (e) {}
      }}
    >
      {({ submitForm, isSubmitting }) => (
        <Modal
          open
          onCancel={onCancel}
          centered
          title={t("media_library.edit_folder")}
          okText={t("common.save")}
          cancelText={t("common.cancel")}
          onOk={submitForm}
          confirmLoading={isSubmitting}
        >
          <div className="py-12">
            <FormField label={t("common.name")}>
              <Field name="name" as={Input} disabled={isSubmitting} />
            </FormField>
          </div>
        </Modal>
      )}
    </Formik>
  );
}
