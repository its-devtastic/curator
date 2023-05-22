import React from "react";
import { useTranslation } from "react-i18next";
import { Avatar, Dropdown } from "antd";
import toColor from "string-to-color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faUserAstronaut,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import useSession from "~/hooks/useSession";

const UserMenu: React.FC = () => {
  const { t } = useTranslation();
  const { user, clearSession } = useSession();
  const navigate = useNavigate();

  return user ? (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      menu={{
        items: [
          {
            key: 1,
            label: t("user_menu.profile"),
            icon: <FontAwesomeIcon icon={faUserAstronaut} />,
            onClick: () => {
              navigate("/profile");
            },
          },
          {
            key: 2,
            label: t("user_menu.log_out"),
            icon: <FontAwesomeIcon icon={faArrowRightFromBracket} />,
            onClick: () => {
              clearSession();
            },
          },
        ],
      }}
    >
      <Avatar
        className="cursor-pointer select-none"
        style={{ backgroundColor: toColor(user.email) }}
      >
        {(
          user.username?.[0] ||
          user.firstname?.[0] ||
          user.email[0]
        ).toUpperCase()}
      </Avatar>
    </Dropdown>
  ) : null;
};

export default UserMenu;
