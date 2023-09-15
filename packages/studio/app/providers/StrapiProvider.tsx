import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAsync } from "react-use";
import * as R from "ramda";
import { Button, Result } from "antd";
import { useTranslation } from "react-i18next";

import { StrapiContentType, StrapiComponent } from "@/types/contentType";
import { StrapiLocale } from "@/types/locales";
import { Permission, UserRole } from "@/types/permission";

import useSession from "@/hooks/useSession";
import useCurator from "@/hooks/useCurator";

import { StrapiSdk } from "@/utils/sdk";

export const Context = createContext<{
  sdk: StrapiSdk;
  locales: StrapiLocale[];
  components: StrapiComponent[];
  contentTypes: StrapiContentType[];
  permissions: Permission[];
  roles: UserRole[];
  refresh: () => Promise<void>;
}>({} as any);

export const StrapiProvider: React.FC<{
  apiUrl: string;
  children: React.ReactNode;
}> = ({ apiUrl, children }) => {
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

  const { error } = useAsync(async () => {
    sdk.setAuthorization(token);

    if (token) {
      const user = await sdk.getMe();
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
      setSession({ user });

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
      {error && (
        <div className="h-screen flex flex-col justify-center">
          <div className="p-4">
            <Result
              status="500"
              title={t("network_error.title")}
              subTitle={t("network_error.sub_title")}
              extra={
                <Button onClick={() => window.location.reload()}>
                  {t("network_error.try_again")}
                </Button>
              }
            />
          </div>
        </div>
      )}
      {init && children}
    </Context.Provider>
  );
};

export default StrapiProvider;
