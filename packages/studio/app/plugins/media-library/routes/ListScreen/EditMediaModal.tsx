import React from "react";
import { MediaItem } from "@curatorjs/types";
import { Button, Input, Modal, TreeSelect } from "antd";
import { Field, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useAsync } from "react-use";

import FormField from "@/ui/FormField";
import useStrapi from "@/hooks/useStrapi";
import useCurator from "@/hooks/useCurator";

export default function EditMediaModal({
  media,
  onCancel,
  onSave,
  onDelete,
}: {
  media: MediaItem;
  onCancel?: VoidFunction;
  onSave?: VoidFunction;
  onDelete?: VoidFunction;
}) {
  const { t } = useTranslation();
  const {
    images: { getImageUrl },
  } = useCurator();
  const { sdk } = useStrapi();
  const { id, caption, alternativeText, name, folder } = media;

  const { value: folders = [] } = useAsync(async () => {
    try {
      return await sdk.getFolderStructure();
    } catch (e) {}
  }, []);

  return (
    <Formik
      initialValues={{
        caption,
        alternativeText,
        name,
        folder: folder?.id ?? null,
      }}
      onSubmit={async (values) => {
        try {
          await sdk.updateMediaItem({ id, ...values });
          onSave?.();
        } catch (e) {}
      }}
    >
      {({ submitForm, isSubmitting, setFieldValue, values }) => (
        <Modal
          open
          centered
          onCancel={onCancel}
          title={t("media_library.edit_media_item")}
          confirmLoading={isSubmitting}
          footer={
            <div className="flex items-center justify-between">
              <Button
                danger
                type="text"
                onClick={async () => {
                  await sdk.deleteMediaItem(id);
                  onDelete?.();
                }}
              >
                {t("common.delete")}
              </Button>
              <div>
                <Button onClick={onCancel}>{t("common.cancel")}</Button>
                <Button onClick={submitForm} type="primary">
                  {t("common.save")}
                </Button>
              </div>
            </div>
          }
        >
          <div className="py-12 flex flex-col items-center md:flex-row md:items-start gap-12">
            <div className="">
              <img
                src={getImageUrl(media)}
                alt=""
                className="w-32 h-32 object-contain"
              />
            </div>
            <div className="space-y-4 w-full md:w-auto flex-1">
              <FormField label={t("common.name")}>
                <Field name="name" as={Input} disabled={isSubmitting} />
              </FormField>
              <FormField label={t("common.caption")}>
                <Field name="caption" as={Input} disabled={isSubmitting} />
              </FormField>
              <FormField label={t("common.alternative_text")}>
                <Field
                  name="alternativeText"
                  as={Input}
                  disabled={isSubmitting}
                />
              </FormField>
              <FormField label={t("common.location")}>
                <TreeSelect
                  className="w-full"
                  disabled={isSubmitting}
                  onChange={(value) => setFieldValue("folder", value || null)}
                  value={values.folder ?? ""}
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
