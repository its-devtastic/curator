import {
  Button,
  cn,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Pagination,
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@curatorjs/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { TFunction } from "i18next";
import * as R from "ramda";
import React, { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiTranslateBold } from "react-icons/pi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

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

export function ListScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [create, setCreate] = useState<string | null>(null);
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
  const hasReadPermission = hasPermission("read", apiID);
  const hasCreatePermission = hasPermission("create", apiID);
  /*
   * Reset state whenever the route params change.
   * Has to be a layout effect to avoid stale data flash.
   */
  useLayoutEffect(() => {
    setCreate(null);
  }, [params]);

  const { data, isLoading } = useQuery({
    enabled: hasReadPermission,
    queryKey: ["content", apiID, convertSearchParamsToObject(searchParams)],
    async queryFn({ queryKey }) {
      return await sdk.getMany(
        queryKey[1] as string,
        queryKey[2] as Record<string, string>,
      );
    },
  });

  return hasReadPermission || hasCreatePermission ? (
    <div className="px-4 lg:px-12 py-6">
      {create && (
        <CreateContentDialog
          apiID={apiID}
          onCancel={() => setCreate(null)}
          onCreate={({ id }) => navigate(`/content-manager/${apiID}/${id}`)}
        />
      )}
      {contentTypeConfig && contentType && !isLoading ? (
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
                <FilterToolbar contentType={contentType} loading={isLoading} />
                <DataTable
                  data={data?.results ?? []}
                  onRowClick={(_, record) => {
                    navigate(`/content-manager/${apiID}/${record.id}`);
                  }}
                  columns={
                    [
                      hasDraftState && {
                        id: "draftStatus",
                        accessorKey: "publishedAt",
                        header: "",
                        cell({ row }: any) {
                          const id = row.getValue("id");
                          const value = row.getValue("publishedAt");
                          return (
                            <Tooltip>
                              <TooltipContent>
                                {value
                                  ? t("common.published")
                                  : t("common.draft")}
                              </TooltipContent>
                              <DropdownMenu>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    {value
                                      ? t("common.unpublish")
                                      : t("common.publish")}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                                <DropdownMenuTrigger asChild>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        const isDraft = !value;
                                        try {
                                          isDraft
                                            ? await sdk.publish(apiID, id)
                                            : await sdk.unpublish(apiID, id);
                                          await queryClient.invalidateQueries({
                                            queryKey: ["content", apiID],
                                          });
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
                                      }}
                                    >
                                      <div
                                        className={cn(
                                          "size-1.5 rounded-full",
                                          value
                                            ? "bg-emerald-500"
                                            : "bg-amber-400",
                                        )}
                                      />
                                    </Button>
                                  </TooltipTrigger>
                                </DropdownMenuTrigger>
                              </DropdownMenu>
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
                                    <img
                                      src={curatorConfig.images.getImageUrl(
                                        value,
                                      )}
                                      alt=""
                                      width={64}
                                      height={64}
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
                          <Tooltip>
                            <TooltipContent>
                              {t("common.translation_other")}
                            </TooltipContent>
                            <TooltipTrigger asChild>
                              <span className="inline-flex">
                                <PiTranslateBold size={16} />
                              </span>
                            </TooltipTrigger>
                          </Tooltip>
                        ),
                        id: "localizations",
                        accessorKey: "localizations",
                        cell({ cell, row }: any) {
                          const localizations = cell.getValue();
                          const locale = row.original.locale;
                          return (
                            <div>
                              {R.sortBy(R.prop("locale"))([
                                { locale },
                                ...localizations,
                              ]).map(({ locale = "" }) => (
                                <Tooltip key={locale}>
                                  <TooltipContent>
                                    {t(`locales.${locale}`)}
                                  </TooltipContent>
                                  <TooltipTrigger asChild>
                                    <span
                                      className={`mr-1 rounded-sm inline-flex fi fi-${
                                        locale.startsWith("en")
                                          ? "us"
                                          : locale.split("-")[0]
                                      }`}
                                    />
                                  </TooltipTrigger>
                                </Tooltip>
                              ))}
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
                  total={data?.pagination?.total}
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
