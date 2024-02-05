import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@curatorjs/ui";
import { Avatar, Modal, Tag, Typography } from "antd";
import * as R from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import toColor from "string-to-color";

import useModifierKey from "@/hooks/useModifierKey";
import useSession from "@/hooks/useSession";

const UserMenu: React.FC = () => {
  const { t } = useTranslation();
  const { user, profile, clearSession } = useSession();
  const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal();
  const modifierKey = useModifierKey();

  return user ? (
    <>
      {contextHolder}
      <DropdownMenu>
        <DropdownMenuTrigger>
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
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            <div className="">
              <div className="font-semibold text-sm">
                {`${user?.firstname ?? ""} ${user?.lastname ?? ""}`}
              </div>
              <div className="font-normal text-muted-foreground text-xs">
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
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            {t("user_menu.profile")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
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
            }}
          >
            {t("help_menu.shortcuts")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              window.open("https://its-devtastic.github.io/curator");
            }}
          >
            {t("help_menu.docs")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => clearSession()}>
            <span className="text-destructive">{t("user_menu.log_out")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  ) : null;
};

export default UserMenu;
