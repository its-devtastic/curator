import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faDesktop } from "@fortawesome/free-solid-svg-icons";

import AppHeaderItem from "~/ui/AppHeader/AppHeaderItem";
import useModifierKey from "~/hooks/useModifierKey";
import { useLocalStorage } from "react-use";

const DarkModeToggle: React.FC = () => {
  const { t } = useTranslation();
  const modifierKey = useModifierKey();
  const [scheme, setScheme, removeScheme] = useLocalStorage<"light" | "dark">(
    "color_scheme"
  );
  const darkModeEnabled =
    scheme === "dark" ||
    (!scheme && window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    if (darkModeEnabled) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkModeEnabled]);

  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      dropdownRender={(menu) => (
        <div className="shadow-xl shadow-gray-700/5 bg-white rounded-lg border border-solid border-gray-200 dark:border-gray-800 overflow-hidden">
          {React.cloneElement(menu as React.ReactElement, {
            style: { boxShadow: "none", borderRadius: 0, border: "none" },
          })}
        </div>
      )}
      menu={{
        items: [
          {
            key: 1,
            label: t("dark_mode.light"),
            icon: <FontAwesomeIcon icon={faSun} />,
            onClick: () => {
              setScheme("light");
            },
          },
          {
            key: 2,
            label: t("dark_mode.dark"),
            icon: <FontAwesomeIcon icon={faMoon} />,
            onClick: () => {
              setScheme("dark");
            },
          },
          {
            key: 3,
            label: t("dark_mode.system"),
            icon: <FontAwesomeIcon icon={faDesktop} />,
            onClick: () => {
              removeScheme();
            },
          },
        ],
      }}
    >
      <AppHeaderItem>
        <FontAwesomeIcon icon={darkModeEnabled ? faMoon : faSun} />
      </AppHeaderItem>
    </Dropdown>
  );
};

export default DarkModeToggle;
