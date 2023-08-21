import React, { createContext, useCallback, useState } from "react";
import { useAsync } from "react-use";

import useStrapi from "@/hooks/useStrapi";
import useSession from "@/hooks/useSession";

export const Context = createContext({} as any);

const SecretsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { sdk } = useStrapi();
  const { token } = useSession();

  const { value: secrets = {} } = useAsync(async () => {
    try {
      const { value } = await sdk.getOne<{
        value: { key: string; value: string }[];
      }>("secret");

      return value.reduce<Record<string, string>>(
        (acc, { key, value }) => ({ ...acc, [key]: value }),
        {}
      );
    } catch (e) {
      console.error(e);
    }
  }, [sdk, token]);

  const getSecret = useCallback(
    (key: string) => {
      if (key.startsWith("$")) {
        return secrets[key.slice(1)] || key;
      }
      return key;
    },
    [secrets]
  );

  return (
    <Context.Provider value={{ secrets, getSecret }}>
      {children}
    </Context.Provider>
  );
};

export default SecretsProvider;
