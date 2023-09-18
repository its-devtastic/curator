import React from "react";
import { Select } from "antd";
import useStrapi from "@/hooks/useStrapi";
import { useAsync } from "react-use";
import { PermissionConfig } from "@/types/permission";
import * as R from "ramda";

const PermissionsSelect: React.FC<{
  onChange?(): void;
  value?: string[];
}> = ({ value, onChange }) => {
  const { sdk } = useStrapi();

  const { value: items = [] } = useAsync(async () => {
    try {
      const permissions = await sdk.getAllPermissions();

      return R.sortBy(
        R.identity,
        Object.entries(permissions).flatMap(
          ([namespace, config]: [string, PermissionConfig]) =>
            Object.entries(config.controllers).flatMap(([scope, perms]) =>
              perms.flatMap((perm) => `${namespace}.${scope}.${perm}`),
            ),
        ),
      );
    } catch (e) {}
  }, [sdk]);

  return (
    <Select
      value={value ?? []}
      onChange={onChange}
      mode="multiple"
      className="w-full"
      options={items.map((perm) => ({ label: perm, value: perm }))}
    />
  );
};

export default PermissionsSelect;
