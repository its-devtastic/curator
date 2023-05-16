import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { message, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

import AppHeader from "~/ui/AppHeader";
import useSecrets from "~/hooks/useSecrets";

const AppHeaderItem: React.FC<{
  url: string;
}> = ({ url }) => {
  const { t } = useTranslation();
  const { getSecret } = useSecrets();
  const [loading, setLoading] = useState(false);

  return (
    <Tooltip title={t("trigger.purge")}>
      <AppHeader.Item
        onClick={async () => {
          try {
            setLoading(true);
            message.loading({
              key: "build",
              content: t("trigger.purge_started"),
              duration: 0,
            });
            await axios.post(getSecret(url));
          } catch (e: any) {
            message.error(t("trigger.purge_failed"));
          } finally {
            message.destroy("build");
            setLoading(false);
          }
        }}
      >
        <FontAwesomeIcon
          icon={faArrowsRotate}
          className={classNames("text-emerald-400", {
            "animate-spin": loading,
          })}
        />
      </AppHeader.Item>
    </Tooltip>
  );
};

export default AppHeaderItem;
