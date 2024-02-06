import { AdminUser, Pagination as IPagination } from "@curatorjs/types";
import { Badge, Button, DataTable } from "@curatorjs/ui";
import * as R from "ramda";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PiUserCirclePlus } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useAsyncRetry } from "react-use";

import useStrapi from "@/hooks/useStrapi";

import InviteUserModal from "./InviteUserModal";

export default function TeamList() {
  const { t } = useTranslation();
  const { sdk, permissions } = useStrapi();
  const navigate = useNavigate();
  const canCreate = permissions.some(
    R.whereEq({ action: "admin::users.create" }),
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
    const data = await sdk.getAdminUsers({ sort: "id:DESC" });
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
        <div className="flex items-center justify-between my-12 pb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">{t("team.title")}</h1>
            <div className="text-sm text-muted-foreground">
              {t("team.description")}
            </div>
          </div>
          {canCreate && (
            <Button onClick={() => setCreate(true)}>
              <PiUserCirclePlus className="size-4 mr-2" />
              <span>{t("team.invite")}</span>
            </Button>
          )}
        </div>
        <DataTable
          data={collection.results}
          onRowClick={(_, { id }) => navigate(`/team/${id}`)}
          columns={[
            {
              header: t("common.name"),
              cell({ row }) {
                return (
                  <span className="font-medium">
                    {`${row.original.firstname ?? ""} ${
                      row.original.lastname ?? ""
                    }`.trim()}
                  </span>
                );
              },
            },
            {
              header: t("common.email"),
              accessorKey: "email",
            },
            {
              accessorKey: "roles",
              header: "",
              cell({ cell }) {
                return (
                  <div className="space-x-1">
                    {cell.getValue().map((role: AdminUser["roles"][number]) => (
                      <Badge key={role.id} variant="outline">
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                );
              },
            },
            {
              accessorKey: "isActive",
              header: "",
              cell({ cell }) {
                const isActive = cell.getValue();
                return (
                  <Badge variant={isActive ? "success" : "secondary"}>
                    {isActive ? t("common.active") : t("common.inactive")}
                  </Badge>
                );
              },
            },
          ]}
        />
      </div>
    </>
  );
}
