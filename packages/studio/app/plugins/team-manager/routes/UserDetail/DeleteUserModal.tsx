import { AdminUser } from "@curatorjs/types";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input, Modal, notification } from "antd";
import { Field, Formik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import * as Schema from "yup";

import useStrapi from "@/hooks/useStrapi";
import FormField from "@/ui/FormField";

export default function DeleteUserModal({
  onClose,
  onDelete,
  user,
}: {
  user: AdminUser;
  onClose?: VoidFunction;
  onDelete?: VoidFunction;
}) {
  const { t } = useTranslation();
  const { sdk, roles } = useStrapi();

  const validationSchema = Schema.object({
    confirm: Schema.string().equals(["DELETE"]).required(),
  });

  return (
    <Formik
      initialValues={{ confirm: "" }}
      validationSchema={validationSchema}
      validateOnMount
      onSubmit={async () => {
        try {
          await sdk.deleteAdminUser(user.id);
          notification.success({
            message: t("team.user_deleted", {
              name: `${user.firstname} ${user.lastname}`,
            }),
          });
          onDelete?.();
        } catch (e) {}
      }}
    >
      {({ isSubmitting, submitForm, isValid }) => (
        <Modal
          open
          centered
          title={
            <span className="space-x-2">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="text-red-500"
              />
              <span>{t("team.delete_user")}</span>
            </span>
          }
          cancelText={t("common.cancel")}
          okText={t("team.delete_user")}
          onCancel={onClose}
          okButtonProps={{ danger: true, disabled: !isValid }}
          onOk={submitForm}
          confirmLoading={isSubmitting}
        >
          <div className="mb-6">{t("phrases.are_you_sure")}</div>
          <FormField label={t("phrases.type_delete")}>
            <Field name="confirm" as={Input} placeholder="DELETE" />
          </FormField>
        </Modal>
      )}
    </Formik>
  );
}
