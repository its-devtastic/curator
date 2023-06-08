import React from "react";
import { useTranslation } from "react-i18next";
import { Avatar, Dropdown, Tag } from "antd";
import toColor from "string-to-color";
import * as R from "ramda";
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
      dropdownRender={(menu) => (
        <div className="shadow-xl shadow-gray-700/5 bg-white rounded-lg border border-solid border-gray-200">
          <div className="py-2 px-4 border-b border-0 border-solid border-gray-200">
            <div className="font-semibold text-sm">
              {`${user?.firstname ?? ""} ${user?.lastname ?? ""}`}
            </div>
            <div className="text-gray-500 text-xs">{user?.email}</div>
            {user.roles && !R.isEmpty(user.roles) && (
              <div className="mt-2">
                <Tag color="geekblue">{user.roles[0].name}</Tag>
              </div>
            )}
          </div>
          {React.cloneElement(menu as React.ReactElement, {
            style: { boxShadow: "none" },
          })}
        </div>
      )}
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
