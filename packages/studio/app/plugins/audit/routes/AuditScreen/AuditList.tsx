import { Badge, DataTable, Pagination } from "@curatorjs/ui";
import * as R from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useAsync, useAsyncRetry } from "react-use";

import useStrapi from "@/hooks/useStrapi";
import CalendarTime from "@/ui/CalendarTime";

export default function AuditList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { sdk } = useStrapi();

  const { value, loading, retry } = useAsyncRetry(async () => {
    return await sdk.getMany("curator-audit-log", {
      page: searchParams.has("p") ? Number(searchParams.get("p")) : undefined,
      sort: "createdAt:DESC",
    });
  }, [sdk, searchParams]);

  const { value: adminUsers = [] } = useAsync(async () => {
    const ids = R.pipe<any, any, any, any, any>(
      R.defaultTo([]),
      R.pluck("subjectId"),
      R.reject(R.isNil),
      R.uniq,
    )(value?.results) as string[];

    if (R.isEmpty(ids)) {
      return [];
    }

    const { results } = await sdk.getAdminUsers({
      "filters[id][$in]": ids,
    });

    return results;
  }, [sdk, value?.results]);

  return (
    <div className="px-4 md:px-12">
      <div className="flex items-center justify-between my-12">
        <div>
          <h1 className="text-3xl font-bold mb-1">{t("audit.title")}</h1>
          <div className="text-sm text-muted-foreground">
            {t("audit.description")}
          </div>
        </div>
      </div>
      <DataTable
        data={value?.results ?? []}
        columns={[
          {
            accessorKey: "createdAt",
            header: "",
            cell({ cell }) {
              return (
                <CalendarTime className="text-xs text-gray-500">
                  {cell.getValue<string>()}
                </CalendarTime>
              );
            },
          },
          {
            accessorKey: "action",
            header: "",
            cell({ cell }) {
              const action = cell.getValue<string>();
              return (
                <Badge
                  variant={
                    {
                      create: "success",
                      update: "outline",
                      delete: "destructive",
                    }[action] as any
                  }
                >
                  {action.toUpperCase()}
                </Badge>
              );
            },
          },
          {
            accessorKey: "objectUid",
            header: t("audit.object"),
          },
          {
            accessorKey: "objectId",
            header: t("audit.id"),
          },
          {
            accessorKey: "subjectId",
            header: t("audit.subject"),
            cell({ cell }) {
              const subjectId = cell.getValue<number>();
              const user =
                subjectId &&
                adminUsers.find(R.whereEq({ id: Number(subjectId) }));

              return user ? (
                <div className="text-xs">
                  <div className="font-semibold">
                    {[user.firstname, user.lastname].filter(Boolean).join(" ")}
                  </div>
                  <div className="text-gray-500">{user.email}</div>
                </div>
              ) : (
                subjectId
              );
            },
          },
        ]}
      />
      <div className="my-4">
        <Pagination
          current={value?.pagination.page ?? 1}
          pageSize={value?.pagination.pageSize}
          total={value?.pagination.total}
          onChange={(page) =>
            setSearchParams((searchParams) => {
              searchParams.set("p", String(page));

              return searchParams;
            })
          }
        />
      </div>
    </div>
  );
}
