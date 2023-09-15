import React, { createContext, useCallback } from "react";
import { useAsync } from "react-use";

import useStrapi from "@/hooks/useStrapi";
import useSession from "@/hooks/useSession";
import useCurator from "@/hooks/useCurator";
import Spinner from "@/ui/Spinner";

export const Context = createContext({} as any);

const SecretsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { sdk } = useStrapi();
  const { secrets: enabled } = useCurator();
  const { token } = useSession();

  const { value: secrets = {}, loading } = useAsync(async () => {
    // Don't fetch anything if the secrets feature is disabled
    if (!enabled) {
      return;
    }
    try {
      return await sdk.getSecrets();
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
    [secrets],
  );

  return (
    <Context.Provider value={{ secrets, getSecret }}>
      {enabled && loading ? (
        <div className="h-screen flex items-center justify-center">
          <Spinner size={24} />
        </div>
      ) : (
        children
      )}
    </Context.Provider>
  );
};

export default SecretsProvider;
