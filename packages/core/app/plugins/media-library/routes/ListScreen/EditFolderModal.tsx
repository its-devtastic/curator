import React from "react";
import { MediaFolder } from "~/types/media";
import { Input, Modal, TreeSelect } from "antd";
import { Field, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useAsync } from "react-use";

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

  const { value: folders = [] } = useAsync(async () => {
    try {
      return await sdk.getFolderStructure();
    } catch (e) {}
  }, []);

  console.log(folder);

  return (
    <Formik
      initialValues={{
        id: folder.id,
        name: folder.name,
        parent: folder.parent?.id ?? null,
      }}
      onSubmit={async ({ id, name, parent }) => {
        try {
          await sdk.updateFolder({ id, name, parent });
          onSave?.();
        } catch (e) {}
      }}
    >
      {({ submitForm, isSubmitting, setFieldValue, values }) => (
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
            <div className="flex items-center gap-4">
              <FormField label={t("common.name")} className="flex-1">
                <Field name="name" as={Input} disabled={isSubmitting} />
              </FormField>
              <FormField label={t("common.location")} className="flex-1">
                <TreeSelect
                  className="w-full"
                  disabled={isSubmitting}
                  onChange={(value) => setFieldValue("parent", value || null)}
                  value={values.parent ?? ""}
                  showSearch
                  filterTreeNode={(input, { name }) =>
                    name.toLowerCase().includes(input.toLowerCase())
                  }
                  fieldNames={{
                    label: "name",
                    children: "children",
                    value: "id",
                  }}
                  treeData={[
                    { name: "Media Library", children: folders, id: "" },
                  ]}
                />
              </FormField>
            </div>
          </div>
        </Modal>
      )}
    </Formik>
  );
}
