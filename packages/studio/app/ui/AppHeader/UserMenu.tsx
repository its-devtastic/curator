import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@curatorjs/ui";
import { useQuery } from "@tanstack/react-query";
import * as R from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import toColor from "string-to-color";

import useCurator from "@/hooks/useCurator";
import useSession from "@/hooks/useSession";
import useStrapi from "@/hooks/useStrapi";

const UserMenu: React.FC = () => {
  const { t } = useTranslation();
  const { user, clearSession } = useSession();
  const { sdk } = useStrapi();
  const { userAvatars } = useCurator();
  const navigate = useNavigate();

  const { data } = useQuery({
    enabled: userAvatars,
    queryKey: ["user-avatar"],
    async queryFn() {
      return sdk.getAvatar();
    },
  });

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar
          className="w-8 h-8 cursor-pointer"
          style={{
            backgroundColor: toColor(user.email),
          }}
        >
          {data && <AvatarImage src={data} />}
          <AvatarFallback className="font-semibold">
            {(
              user.username?.[0] ||
              user.firstname?.[0] ||
              user.email[0]
            ).toUpperCase()}
          </AvatarFallback>
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
                <Badge>{user.roles[0].name}</Badge>
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            {t("user_menu.profile")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              window.open("https://its-devtastic.github.io/curator");
            }}
          >
            {t("help_menu.docs")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => clearSession()}>
          <span className="text-destructive">{t("user_menu.log_out")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;
};

export default UserMenu;
