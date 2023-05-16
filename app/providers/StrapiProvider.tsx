import React, { createContext, useEffect, useMemo, useState } from "react";
import { useAsync } from "react-use";
import * as R from "ramda";

import { ContentType, StrapiComponent } from "~/types/contentType";
import { StrapiLocale } from "~/types/locales";

import useSession from "~/hooks/useSession";

import { StrapiSdk } from "~/utils/sdk";

export const Context = createContext<{
  sdk: StrapiSdk;
  locales: StrapiLocale[];
  components: StrapiComponent[];
  contentTypes: ContentType[];
}>({} as any);

export const StrapiProvider: React.FC<{
  apiUrl: string;
  children: React.ReactNode;
}> = ({ apiUrl, children }) => {
  const { token, clearSession } = useSession();
  const [init, setInit] = useState(false);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [components, setComponents] = useState<StrapiComponent[]>([]);
  const [locales, setLocales] = useState<StrapiLocale[]>([]);
  const sdk = useMemo(() => new StrapiSdk(apiUrl), []);

  useEffect(() => {
    sdk.http.interceptors.response.use(R.identity, (error) => {
      if (error.response.status === 401) {
        clearSession();
      }
      throw error;
    });
  }, [clearSession]);

  useAsync(async () => {
    sdk.setAuthorization(token);

    if (token) {
      const contentTypes = await sdk.getContentTypes();
      const components = await sdk.getComponents();
      const locales = await sdk.getLocales();
      setContentTypes(contentTypes);
      setComponents(components);
      setLocales(locales);
    }

    setInit(true);
  }, [token]);

  return (
    <Context.Provider value={{ sdk, locales, contentTypes, components }}>
      {init && children}
    </Context.Provider>
  );
};

export default StrapiProvider;
