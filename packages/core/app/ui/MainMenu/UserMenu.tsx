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

import useSession from "~/hooks/useSession";
import useModifierKey from "~/hooks/useModifierKey";

const UserMenu: React.FC = () => {
  const { t } = useTranslation();
  const { user, clearSession } = useSession();
  const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal();
  const modifierKey = useModifierKey();

  return user ? (
    <>
      {contextHolder}
      <Dropdown
        trigger={["click"]}
        placement="topRight"
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
                    <table className="w-full py-12">
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
        <div className="flex items-center gap-3 cursor-pointer select-none py-2 px-4 hover:bg-black/5 rounded-md">
          <Avatar
            shape="square"
            style={{ backgroundColor: toColor(user.email) }}
          >
            {(
              user.username?.[0] ||
              user.firstname?.[0] ||
              user.email[0]
            ).toUpperCase()}
          </Avatar>
          <div>
            <div className="font-semibold text-sm">
              {`${user?.firstname ?? ""} ${user?.lastname ?? ""}`}
            </div>
            {user.roles && !R.isEmpty(user.roles) && (
              <div className="text-xs font-semibold text-gray-400">
                {user.roles[0].name}
              </div>
            )}
          </div>
        </div>
      </Dropdown>
    </>
  ) : null;
};

export default UserMenu;
