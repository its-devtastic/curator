import React from "react";
import { useTranslation } from "react-i18next";
import { Avatar, Dropdown, Modal, Tag, Typography } from "antd";
import toColor from "string-to-color";
import * as R from "ramda";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faBook,
  faKeyboard,
  faUserAstronaut,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import useSession from "@/hooks/useSession";
import useModifierKey from "@/hooks/useModifierKey";

const UserMenu: React.FC = () => {
  const { t } = useTranslation();
  const { user, profile, clearSession } = useSession();
  const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal();
  const modifierKey = useModifierKey();

  return user ? (
    <>
      {contextHolder}
      <Dropdown
        trigger={["click"]}
        placement="topLeft"
        dropdownRender={(menu) => (
          <div className="shadow-xl shadow-gray-700/5 bg-white dark:bg-gray-800 rounded-lg border border-solid border-gray-200 dark:border-gray-600">
            <div className="py-2 px-4 border-b border-0 border-solid border-gray-200 dark:border-gray-600">
              <div className="font-semibold text-sm dark:text-gray-50">
                {`${user?.firstname ?? ""} ${user?.lastname ?? ""}`}
              </div>
              <div className="text-gray-500 dark:text-gray-300 text-xs">
                {user?.email}
              </div>
              {user.roles && !R.isEmpty(user.roles) && (
                <div className="mt-2">
                  <Tag color="geekblue" bordered={false}>
                    {user.roles[0].name}
                  </Tag>
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
              key: "profile",
              label: t("user_menu.profile"),
              icon: <FontAwesomeIcon icon={faUserAstronaut} />,
              onClick: () => {
                navigate("/profile");
              },
            },
            {
              key: "shortcuts",
              label: t("help_menu.shortcuts"),
              icon: <FontAwesomeIcon icon={faKeyboard} />,
              onClick: () => {
                modal.info({
                  title: t("help_menu.shortcuts"),
                  centered: true,
                  content: (
                    <table className="w-full py-12 dark:text-gray-50">
                      <tbody>
                        <tr>
                          <td className="text-sm">{t("common.save")}</td>
                          <td>
                            <Typography.Text
                              keyboard
                            >{`${modifierKey.label}+S`}</Typography.Text>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ),
                  okText: t("common.close"),
                  okType: "default",
                });
              },
            },
            {
              key: "docs",
              label: t("help_menu.docs"),
              icon: <FontAwesomeIcon icon={faBook} />,
              onClick: () => {
                window.open("https://its-devtastic.github.io/curator");
              },
            },
            { type: "divider" },
            {
              key: "logout",
              danger: true,
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
          shape="circle"
          className="w-8 h-8 cursor-pointer"
          style={{
            backgroundColor: !profile?.avatar?.url
              ? toColor(user.email)
              : undefined,
          }}
          src={profile?.avatar?.url}
        >
          <span className="font-semibold">
            {(
              user.username?.[0] ||
              user.firstname?.[0] ||
              user.email[0]
            ).toUpperCase()}
          </span>
        </Avatar>
      </Dropdown>
    </>
  ) : null;
};

export default UserMenu;
