import React from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, Modal, Typography } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faBook,
  faKeyboard,
} from "@fortawesome/free-solid-svg-icons";

import AppHeaderItem from "~/ui/AppHeader/AppHeaderItem";
import useModifierKey from "~/hooks/useModifierKey";
import logo from "~/assets/logo.svg";
import pkg from "../../../package.json";

const HelpMenu: React.FC = () => {
  const { t } = useTranslation();
  const [modal, contextHolder] = Modal.useModal();
  const modifierKey = useModifierKey();

  return (
    <>
      {contextHolder}
      <Dropdown
        trigger={["click"]}
        placement="bottomRight"
        dropdownRender={(menu) => (
          <div className="shadow-xl shadow-gray-700/5 bg-white rounded-lg border border-solid border-gray-200">
            <div>
              {React.cloneElement(menu as React.ReactElement, {
                style: { boxShadow: "none" },
              })}
            </div>
            <footer className="border-t border-solid border-0 border-gray-200 flex items-center justify-between p-2 gap-2">
              <img
                src={logo}
                alt="Curator"
                className="object-contain w-auto h-5 select-none"
              />
              <Typography.Text
                code
                className="text-xs font-semibold text-gray-400 select-none"
              >{`v${pkg.version}`}</Typography.Text>
            </footer>
          </div>
        )}
        menu={{
          items: [
            {
              key: 1,
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
                        <tr>
                          <td className="text-sm">
                            {t("content_manager.open_content_manager_menu")}
                          </td>
                          <td>
                            <Typography.Text
                              keyboard
                            >{`${modifierKey.label}+K`}</Typography.Text>
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
              key: 2,
              label: t("help_menu.docs"),
              icon: <FontAwesomeIcon icon={faBook} />,
              onClick: () => {
                window.open("https://its-devtastic.github.io/curator");
              },
            },
          ],
        }}
      >
        <AppHeaderItem>
          <FontAwesomeIcon icon={faQuestionCircle} />
        </AppHeaderItem>
      </Dropdown>
    </>
  );
};

export default HelpMenu;
