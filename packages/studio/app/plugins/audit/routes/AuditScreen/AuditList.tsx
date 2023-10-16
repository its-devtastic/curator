import React from "react";
import { useTranslation } from "react-i18next";
import { Tag } from "antd";
import { useAsync, useAsyncRetry } from "react-use";
import { useSearchParams } from "react-router-dom";
import * as R from "ramda";

import useStrapi from "@/hooks/useStrapi";
import Table from "@/ui/Table";
import Pagination from "@/ui/Pagination";
import { isEmpty } from "ramda";
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
    const ids = R.pipe(
      R.defaultTo([] as any),
      R.pluck("subjectId"),
      R.reject(R.isNil) as any,
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
      <div className="flex items-center justify-between my-12 pb-6 border-b border-0 border-solid border-gray-200">
        <div>
          <h1 className="mt-0 mb-4 font-serif font-normal">
            {t("audit.title")}
          </h1>
          <div className="text-sm text-gray-600">{t("audit.description")}</div>
        </div>
      </div>
      <Table
        dataSource={value?.results}
        loading={loading}
        rowKey="id"
        columns={[
          {
            key: "createdAt",
            dataIndex: "createdAt",
            render(value) {
              return (
                <CalendarTime className="text-xs text-gray-500">
                  {value}
                </CalendarTime>
              );
            },
          },
          {
            key: "action",
            dataIndex: "action",
            render(action: string) {
              return (
                <Tag
                  color={
                    {
                      create: "green",
                      update: "blue",
                      delete: "red",
                    }[action]
                  }
                >
                  {action.toUpperCase()}
                </Tag>
              );
            },
          },
          {
            key: "objectUid",
            dataIndex: "objectUid",
            title: t("audit.object"),
          },
          {
            key: "objectId",
            dataIndex: "objectId",
            title: t("audit.id"),
          },
          {
            key: "subject",
            dataIndex: "subjectId",
            title: t("audit.subject"),
            render(subjectId) {
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
