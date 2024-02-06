import { Spinner } from "@curatorjs/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { createContext, useCallback } from "react";
import { useUpdateEffect } from "react-use";

import useCurator from "@/hooks/useCurator";
import useSession from "@/hooks/useSession";
import useStrapi from "@/hooks/useStrapi";

export const Context = createContext({} as any);

export default function SecretsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sdk } = useStrapi();
  const { secrets: enabled } = useCurator();
  const { token } = useSession();
  const queryClient = useQueryClient();

  const { data: secrets, isPending } = useQuery({
    enabled,
    refetchOnWindowFocus: false,
    queryKey: ["secrets"],
    async queryFn() {
      return await sdk.getSecrets();
    },
  });

  useUpdateEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["secrets"] });
  }, [token]);

  const getSecret = useCallback(
    (key: string) => (key.startsWith("$") && secrets?.[key.slice(1)]) || key,
    [secrets],
  );

  return (
    <Context.Provider value={{ secrets, getSecret }}>
      {enabled && isPending ? (
        <div className="h-screen flex items-center justify-center">
          <Spinner className="size-8" />
        </div>
      ) : (
        children
      )}
    </Context.Provider>
  );
}
