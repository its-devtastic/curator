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
            {React.cloneElement(menu as React.ReactElement, {
              style: { boxShadow: "none" },
            })}
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
                window.open("https://its-devtastic.github.io/strapion-docs");
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
