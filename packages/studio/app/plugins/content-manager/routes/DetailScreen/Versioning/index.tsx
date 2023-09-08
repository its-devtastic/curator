import React from "react";
import { Drawer } from "antd";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
