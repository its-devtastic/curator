import { useContext } from "react";

import { Context } from "@/providers/SecretsProvider";

export default function useSecrets() {
  return useContext<{
    secrets: Record<string, string>;
    getSecret(key: string): string;
  }>(Context);
}
