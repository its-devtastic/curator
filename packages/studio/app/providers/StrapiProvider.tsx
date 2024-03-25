import { StrapiSdk } from "@curatorjs/strapi-sdk";
import {
  Permission,
  StrapiComponent,
  StrapiContentType,
  StrapiLocale,
  UserRole,
} from "@curatorjs/types";
import { Button } from "@curatorjs/ui";
import * as R from "ramda";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { PiCloudWarningDuotone } from "react-icons/pi";
import { useAsync } from "react-use";

import CuratorLogo from "@/components/CuratorLogo";
import useCurator from "@/hooks/useCurator";
import useSession from "@/hooks/useSession";

export const Context = createContext<{
  sdk: StrapiSdk;
  locales: StrapiLocale[];
  components: StrapiComponent[];
  contentTypes: StrapiContentType[];
  permissions: Permission[];
  roles: UserRole[];
  refresh: () => Promise<void>;
}>({} as any);

export default function StrapiProvider({
  apiUrl,
  children,
}: {
  apiUrl: string;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const { token, clearSession, setSession } = useSession();
  const [init, setInit] = useState(false);
  const [contentTypes, setContentTypes] = useState<StrapiContentType[]>([]);
  const [components, setComponents] = useState<StrapiComponent[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [locales, setLocales] = useState<StrapiLocale[]>([]);
  const sdk = useMemo(() => new StrapiSdk(apiUrl), []);
  const { hooks = [] } = useCurator();

  useEffect(() => {
    sdk.http.interceptors.response.use(R.identity, (error) => {
      if (error.response?.status === 401) {
        clearSession();
      }
      throw error;
    });
  }, [clearSession]);

  const { error = false } = useAsync(async () => {
    sdk.setAuthorization(token);

    if (token) {
      const user = await sdk.getMe();
      const profile = await sdk.getExtendedProfile();
      const permissions = await sdk.getPermissions();
      if (permissions.some(R.whereEq({ action: "admin::roles.read" }))) {
        const roles = await sdk.getAdminRoles();
        setRoles(roles);
      }
      const contentTypes = await sdk.getContentTypes();
      const components = await sdk.getComponents();
      const locales = await sdk.getLocales();
      setPermissions(permissions);
      setContentTypes(contentTypes);
      setComponents(components);
      setLocales(locales);
      setSession({ user, profile });

      // Call login hooks
      for (const hook of hooks) {
        if (hook.trigger === "login") {
          hook.action({ entity: { user, token } });
        }
      }
    } else {
      // Call logout hooks
      for (const hook of hooks) {
        if (hook.trigger === "logout") {
          hook.action({ entity: null });
        }
      }
    }

    setInit(true);
  }, [token]);

  const refresh = useCallback(async () => {
    const locales = await sdk.getLocales();
    setLocales(locales);
  }, []);

  return (
    <Context.Provider
      value={{
        sdk,
        locales,
        contentTypes,
        components,
        permissions,
        roles,
        refresh,
      }}
    >
      {error ? (
        <div className="h-screen flex flex-col justify-between items-center">
          <div className="flex-1" />
          <section className="text-center p-4">
            <div className="flex justify-center mb-8">
              <PiCloudWarningDuotone className="size-24 fill-destructive" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              {t("network_error.title")}
            </h2>
            <div className="text-muted-foreground mb-12">
              {t("network_error.sub_title")}
            </div>
            <div>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                {t("network_error.try_again")}
              </Button>
            </div>
          </section>
          <div className="flex-1 flex flex-col justify-end">
            <div className="pb-12">
              <CuratorLogo />
            </div>
          </div>
        </div>
      ) : (
        init && children
      )}
    </Context.Provider>
  );
}
