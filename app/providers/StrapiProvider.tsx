import React, { createContext, useEffect, useMemo, useState } from "react";
import { useAsync } from "react-use";
import * as R from "ramda";
import { Alert } from "antd";

import { ContentType, StrapiComponent } from "~/types/contentType";
import { StrapiLocale } from "~/types/locales";
import { Permission, UserRole } from "~/types/permission";

import useSession from "~/hooks/useSession";

import { StrapiSdk } from "~/utils/sdk";

export const Context = createContext<{
  sdk: StrapiSdk;
  locales: StrapiLocale[];
  components: StrapiComponent[];
  contentTypes: ContentType[];
  permissions: Permission[];
  roles: UserRole[];
}>({} as any);

export const StrapiProvider: React.FC<{
  apiUrl: string;
  children: React.ReactNode;
}> = ({ apiUrl, children }) => {
  const { token, clearSession, setSession } = useSession();
  const [init, setInit] = useState(false);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [components, setComponents] = useState<StrapiComponent[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [locales, setLocales] = useState<StrapiLocale[]>([]);
  const sdk = useMemo(() => new StrapiSdk(apiUrl), []);

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
    }

    setInit(true);
  }, [token]);

  return (
    <Context.Provider
      value={{ sdk, locales, contentTypes, components, permissions, roles }}
    >
      {error && <Alert banner type="error" description={error.message} />}
      {init && children}
    </Context.Provider>
  );
};

export default StrapiProvider;
