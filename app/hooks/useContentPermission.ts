import * as R from "ramda";

import useStrapi from "~/hooks/useStrapi";
import { useCallback } from "react";

export default function useContentPermission() {
  const { permissions, contentTypes } = useStrapi();

  return useCallback(
    (
      action: "read" | "update" | "create" | "delete" | "publish",
      contentType: string,
      field?: string
    ) =>
      permissions.some(
        R.where({
          action: R.equals(`plugin::content-manager.explorer.${action}`),
          subject: R.equals(
            contentTypes.find(R.whereEq({ apiID: contentType }))?.uid
          ),
          properties: R.where({
            fields: R.either(() => !field, R.includes(field)),
          }),
        })
      ),
    [permissions, contentTypes]
  );
}
