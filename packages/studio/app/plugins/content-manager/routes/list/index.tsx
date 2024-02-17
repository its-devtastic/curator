import { Pagination as IPagination } from "@curatorjs/types";
import { Button, DataTable, Pagination, Spinner } from "@curatorjs/ui";
import { Badge, Dropdown, Image, notification, Tooltip } from "antd";
import { TFunction } from "i18next";
import * as R from "ramda";
import React, { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiTranslateBold } from "react-icons/pi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAsyncRetry } from "react-use";

import NoPermission from "@/components/NoPermission";
import useContentPermission from "@/hooks/useContentPermission";
import useCurator from "@/hooks/useCurator";
import useStrapi from "@/hooks/useStrapi";
import CalendarTime from "@/ui/CalendarTime";

import { SORTABLE_FIELD_TYPES } from "../../constants";
import CreateContentDialog from "../../dialogs/CreateContentDialog";
import { usePluginOptions } from "../../hooks";
import { ColumnConfig } from "../../types";
import { convertSearchParamsToObject } from "../../utils";
import FilterToolbar from "./FilterToolbar";

const INITIAL_COLLECTION_STATE = {
  pagination: null,
  results: [],
};

export function ListScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const apiID = params.apiID ?? "";
  const pluginOptions = usePluginOptions(
    (state) => state.options.contentTypes?.[apiID],
  );
  const { contentTypes, sdk } = useStrapi();
  const hasPermission = useContentPermission();
  const contentType = contentTypes.find(R.whereEq({ apiID }));
  const curatorConfig = useCurator();
  const contentTypeConfig = curatorConfig.contentTypes?.find(
    R.whereEq({ apiID }),
  );
  const hasDraftState = contentType?.options.draftAndPublish;
  const name = contentTypeConfig?.name ?? contentType?.info.displayName ?? "";
  const [create, setCreate] = useState<string | null>(null);
  const [collection, setCollection] = useState<{
    pagination: IPagination | null;
    results: any[];
  }>(INITIAL_COLLECTION_STATE);
  const hasReadPermission = hasPermission("read", apiID);
  const hasCreatePermission = hasPermission("create", apiID);
  /*
   * Reset state whenever the route params change.
   * Has to be a layout effect to avoid stale data flash.
   */
  useLayoutEffect(() => {
    setCreate(null);
    setCollection(INITIAL_COLLECTION_STATE);
  }, [params]);

  const { loading, retry } = useAsyncRetry(async () => {
    if (!hasReadPermission) {
      return;
    }

    const data = await sdk.getMany(
      apiID,
      convertSearchParamsToObject(searchParams),
    );
    setCollection(data);
  }, [sdk, contentTypes, apiID, searchParams]);

  return hasReadPermission || hasCreatePermission ? (
    <div className="px-4 lg:px-12 py-6">
      {create && (
        <CreateContentDialog
          apiID={apiID}
          onCancel={() => setCreate(null)}
          onCreate={({ id }) => navigate(`/content-manager/${apiID}/${id}`)}
        />
      )}
      {contentTypeConfig && contentType ? (
        <div>
          <div className="flex flex-col md:flex-row items-center justify-between my-12 md:mb-24 gap-4">
            <h1 className="text-3xl font-bold">
              {t(name, { count: 2, ns: "custom" })}
            </h1>

            {hasCreatePermission && (
              <Button
                onClick={() => {
                  if (
                    pluginOptions?.create &&
                    pluginOptions.create?.when !== "relation"
                  ) {
                    return setCreate(apiID);
                  }
                  navigate(`/content-manager/${apiID}/create`);
                }}
              >
                {`${t("phrases.create_new")} ${t(name, {
                  ns: "custom",
                }).toLowerCase()}`}
              </Button>
            )}
          </div>

          {hasReadPermission && (
            <>
              <div className="space-y-4">
                <FilterToolbar
                  contentType={contentType}
                  onRefresh={retry}
                  loading={loading}
                />
                <DataTable
                  data={collection.results}
                  onRowClick={(_, record) => ({
                    onClick: () =>
                      navigate(`/content-manager/${apiID}/${record.id}`),
                  })}
                  columns={
                    [
                      hasDraftState && {
                        id: "draftStatus",
                        accessorKey: "publishedAt",
                        width: 40,
                        cell({ row }: any) {
                          const id = row.getValue("id");
                          const value = row.getValue("publishedAt");
                          return (
                            <Tooltip
                              placement="top"
                              title={
                                value
                                  ? t("common.published")
                                  : t("common.draft")
                              }
                            >
                              <div
                                className="flex"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <Dropdown
                                  menu={{
                                    items: [
                                      {
                                        key: 1,
                                        label: value
                                          ? t("common.unpublish")
                                          : t("common.publish"),
                                        async onClick() {
                                          const isDraft = !value;
                                          try {
                                            const data = isDraft
                                              ? await sdk.publish(apiID, id)
                                              : await sdk.unpublish(apiID, id);
                                            setCollection(
                                              R.evolve({
                                                results: R.map((item: any) =>
                                                  item.id === id ? data : item,
                                                ),
                                              }),
                                            );
                                            notification.success({
                                              message: t(
                                                "phrases.document_status_changed",
                                              ),
                                              description: t(
                                                isDraft
                                                  ? "phrases.document_published"
                                                  : "phrases.document_unpublished",
                                              ),
                                            });
                                          } catch (e) {
                                            notification.error({
                                              message: "Oops",
                                            });
                                          }
                                        },
                                      },
                                    ],
                                  }}
                                  trigger={["click"]}
                                >
                                  <Button variant="ghost">
                                    <Badge color={value ? "green" : "yellow"} />
                                  </Button>
                                </Dropdown>
                              </div>
                            </Tooltip>
                          );
                        },
                      },
                      ...R.pathOr([], ["list", "columns"], pluginOptions).map(
                        ({ title = "", ...column }: ColumnConfig) => {
                          const config =
                            column.path &&
                            contentType.attributes[String(column.path)];

                          if (!config) {
                            console.warn(
                              `Could not find config for path ${column.path}`,
                            );
                            return;
                          }

                          const sortable = SORTABLE_FIELD_TYPES.includes(
                            config?.type,
                          );
                          const isSorted =
                            searchParams.get("sort")?.split(":")[0] ===
                            column.path;

                          return {
                            accessorKey: column.path,
                            id: column.path,
                            header: t(title, { ns: "custom" }),
                            width: config?.type === "media" ? 72 : undefined,
                            onHeaderCell: (column: any) => ({
                              onClick: () => {
                                if (sortable) {
                                  setSearchParams((params) => {
                                    params.set(
                                      "sort",
                                      `${column.dataIndex}:${
                                        isSorted
                                          ? params
                                              .get("sort")
                                              ?.split(":")[1] === "DESC"
                                            ? "ASC"
                                            : "DESC"
                                          : "ASC"
                                      }`,
                                    );
                                    return params;
                                  });
                                }
                              },
                            }),
                            sorter: sortable,
                            sortOrder: isSorted
                              ? searchParams.get("sort")?.split(":")[1] ===
                                "ASC"
                                ? "ascend"
                                : "descend"
                              : null,
                            cell({ cell, row }: any) {
                              const value = cell.getValue();

                              if (column.render) {
                                return column.render(value, row, {
                                  t: ((key: string) =>
                                    t(key, { ns: "custom" })) as TFunction,
                                });
                              }
                              switch (config?.type) {
                                case "datetime":
                                  return <CalendarTime>{value}</CalendarTime>;
                                case "media":
                                  return value?.mime?.startsWith("image/") ? (
                                    <Image
                                      src={curatorConfig.images.getImageUrl(
                                        value,
                                      )}
                                      alt=""
                                      width={64}
                                      height={64}
                                      preview={false}
                                      fallback="/image_fallback.png"
                                      className="rounded-md object-cover"
                                    />
                                  ) : (
                                    value
                                  );
                                default:
                                  return value;
                              }
                            },
                          };
                        },
                      ),
                      contentType?.pluginOptions.i18n?.localized && {
                        header: (
                          <Tooltip title={t("common.translation_plural")}>
                            <PiTranslateBold size={16} />
                          </Tooltip>
                        ),
                        id: "localizations",
                        accessorKey: "localizations",
                        cell({ cell }: any) {
                          return (
                            <div className="space-x-1">
                              {R.sortBy(R.prop("locale"))([]).map(
                                ({ locale = "" }) => (
                                  <Tooltip
                                    key={locale}
                                    title={t(`locales.${locale}`)}
                                  >
                                    <span
                                      className={`rounded-sm fi fi-${
                                        locale.startsWith("en")
                                          ? "us"
                                          : locale.split("-")[0]
                                      }`}
                                    />
                                  </Tooltip>
                                ),
                              )}
                            </div>
                          );
                        },
                      },
                    ].filter(Boolean) as any
                  }
                />
                <Pagination
                  current={Number(searchParams.get("page") ?? 1)}
                  pageSize={Number(searchParams.get("pageSize") ?? 10)}
                  total={collection.pagination?.total}
                  onChange={(page) => {
                    setSearchParams((params) => {
                      params.set("page", String(page));
                      return params;
                    });
                  }}
                />
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen max-w-screen-xl">
          <Spinner />
        </div>
      )}
    </div>
  ) : (
    <NoPermission />
  );
}
