import * as R from "ramda";
import { useCallback } from "react";

import useStrapi from "@/hooks/useStrapi";

export default function useContentPermission() {
  const { permissions, contentTypes } = useStrapi();

  return useCallback(
    (
      action: "read" | "update" | "create" | "delete" | "publish",
      contentType: string,
      field?: string | null,
    ) =>
      permissions.some(
        R.where({
          action: R.equals(`plugin::content-manager.explorer.${action}`),
          subject: R.equals(
            contentTypes.find(R.whereEq({ apiID: contentType }))?.uid,
          ),
          properties: R.where({
            fields: R.either(
              () => !field,
              (fields: string[]) => fields.some(R.startsWith(field as string)),
            ),
          }),
        }),
      ),
    [permissions, contentTypes],
  );
}
