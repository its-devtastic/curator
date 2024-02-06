import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Drawer } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

import VersionList from "./VersionList";

const Versioning: React.FC<{ show: boolean; onClose: VoidFunction }> = ({
  show,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <Drawer
      open={show}
      placement="right"
      onClose={onClose}
      destroyOnClose
      title={t("common.versioning")}
      closeIcon={<FontAwesomeIcon icon={faArrowLeft} />}
      size="large"
      bodyStyle={{ padding: 0 }}
    >
      <VersionList onRestore={onClose} />
    </Drawer>
  );
};

export default Versioning;
