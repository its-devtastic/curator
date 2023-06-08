import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Tag } from "antd";
import { useAsyncRetry } from "react-use";
import * as R from "ramda";

import { Pagination as IPagination } from "~/types/response";
import { AdminUser } from "~/types/adminUser";
import useStrapi from "~/hooks/useStrapi";
import Table from "~/ui/Table";

import InviteUserModal from "./InviteUserModal";

export default function TeamList() {
  const { t } = useTranslation();
  const { sdk, permissions } = useStrapi();
  const canCreate = permissions.some(
    R.whereEq({ action: "admin::users.create" })
  );
  const [create, setCreate] = useState(false);

  const [collection, setCollection] = useState<{
    pagination: IPagination | null;
    results: AdminUser[];
  }>({
    pagination: null,
    results: [],
  });

  const { loading, retry } = useAsyncRetry(async () => {
    const data = await sdk.getAdminUsers({ sort: "updatedAt:DESC" });
    setCollection(data);
  }, [sdk]);

  return (
    <>
      {create && (
        <InviteUserModal
          onClose={() => setCreate(false)}
          onCreate={() => {
            setCreate(false);
            retry();
          }}
        />
      )}
      <div className="px-4 md:px-12">
        <div className="flex items-center justify-between my-12 pb-6 border-b border-0 border-solid border-gray-200">
          <div>
            <h1 className="mt-0 mb-4">{t("team.title")}</h1>
            <div className="text-sm text-gray-600">{t("team.description")}</div>
          </div>
          {canCreate && (
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => setCreate(true)}
            >
              {t("team.invite")}
            </Button>
          )}
        </div>
        <Table
          dataSource={collection.results}
          loading={loading}
          columns={[
            {
              key: "name",
              title: t("common.name"),
              render(record) {
                return (
                  <span className="font-medium">
                    {`${record.firstname ?? ""} ${
                      record.lastname ?? ""
                    }`.trim()}
                  </span>
                );
              },
            },
            {
              title: t("common.email"),
              key: "email",
              dataIndex: "email",
            },
            {
              key: "roles",
              dataIndex: "roles",
              render(roles: AdminUser["roles"]) {
                return (
                  <div className="space-x-1">
                    {roles.map((role) => (
                      <Tag key={role.id} color="geekblue" bordered={false}>
                        {role.name}
                      </Tag>
                    ))}
                  </div>
                );
              },
            },
            {
              key: "isActive",
              dataIndex: "isActive",
              render(isActive) {
                return (
                  <Tag color={isActive ? "green" : "yellow"} bordered={false}>
                    {isActive ? t("common.active") : t("common.inactive")}
                  </Tag>
                );
              },
            },
          ]}
        />
      </div>
    </>
  );
}
