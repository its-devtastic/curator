import React from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import * as R from "ramda";

import { Entity } from "~/types/content";
import useCurator from "~/hooks/useCurator";
import useStrapi from "~/hooks/useStrapi";
import { PluginOptions } from "~/plugins/content-manager/types";

export default function CreateContentDialog({
  apiID,
  onCreate,
  onCancel,
  pluginOptions,
}: CreateContentDialogProps) {
  const { t } = useTranslation();
  const config = useCurator();
  const { contentTypes } = useStrapi();
  const contentTypeConfig = config.contentTypes?.find(R.whereEq({ apiID }));
  const contentType = contentTypes.find(R.whereEq({ apiID }));

  return contentTypeConfig && contentType ? (
    <Modal
      open
      onCancel={onCancel}
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
      Creating content for {apiID}
    </Modal>
  ) : null;
}

interface CreateContentDialogProps {
  apiID: string;
  onCreate?(document: Entity): void;
  onCancel?: VoidFunction;
  pluginOptions: NonNullable<PluginOptions["contentTypes"]>[""];
}
